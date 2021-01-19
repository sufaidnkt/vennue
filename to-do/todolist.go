package main

import (
	"io"
	"net/http"

	"encoding/json"

	"strconv"

	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gookit/color"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/rs/cors"
	log "github.com/sirupsen/logrus"
)

var db, _ = gorm.Open("mysql", "root:root@/todolist?charset=utf8&parseTime=True&loc=Local")

type TodoItemModel struct {
	Id          int `gorm:"primary_key"`
	Description string
	Completed   bool
	Title       string
	StartTime   time.Time `gorm:"not null;"`
	EndTime     time.Time `gorm:"not null;"`
}

type TodousersModel struct {
	Id        int `gorm:"primary_key"`
	Uid       int
	MeetingId int
	Status    bool
}

const (
	layoutISO = "2006-01-02 15:04:05"
	layoutUS  = "January 2, 2006"
)

func Healthz(w http.ResponseWriter, r *http.Request) {
	log.Info("API Health is OK")
	w.Header().Set("Content-Type", "application/json")
	io.WriteString(w, `{"alive": true}`)
}

func init() {
	log.SetFormatter(&log.TextFormatter{})
	log.SetReportCaller(true)
}

func main() {
	defer db.Close()
	// db.Debug().DropTableIfExists(&TodoItemModel{})
	db.Debug().AutoMigrate(&TodoItemModel{})
	db.Debug().AutoMigrate(&TodousersModel{})

	log.Info("Starting Todolist API server")
	router := mux.NewRouter()
	router.HandleFunc("/healthz", Healthz).Methods("GET")

	router.HandleFunc("/todo-completed", GetCompletedItems).Methods("GET")
	router.HandleFunc("/todo-incomplete", GetIncompleteItems).Methods("GET")

	router.HandleFunc("/todo", CreateItem).Methods("POST")
	router.HandleFunc("/todo/{id}", UpdateItem).Methods("POST")
	router.HandleFunc("/todo/{id}", DeleteItem).Methods("DELETE")

	handler := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE", "PATCH", "OPTIONS"},
	}).Handler(router)

	http.ListenAndServe(":8090", handler)

}

func CreateItem(w http.ResponseWriter, r *http.Request) {
	description := r.FormValue("description")
	title := r.FormValue("title")
	start_time := r.FormValue("start_time")
	end_time := r.FormValue("start_time")

	uids := r.Form["uids"]

	for _, s := range uids {
		PR(s)
	}

	start_t, _ := time.Parse(layoutISO, start_time)
	end_t, _ := time.Parse(layoutISO, end_time)

	log.WithFields(log.Fields{"description": description}).Info("Add new TodoItem. Saving to database.")
	todo := &TodoItemModel{Description: description, Completed: false, Title: title, StartTime: start_t, EndTime: end_t}
	db.Create(&todo)
	result := db.Last(&todo)
	// inserted_id := todo.Id

	var users = []TodousersModel{ (Uid: 10)}

	db.Create(&users)

	// datas := []map[string]interface{}{
	// 	{"Uid": 10, "MeetingId": 19},
	// 	{"Uid": 20, "MeetingId": 29},
	// }

	// db.Model(&TodousersModel{}).Create(datas)

	// for _, user := range meeting {
	// 	user.ID // 1,2,3
	// }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result.Value)

}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
	// Get URL parameter from mux
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	// Test if the TodoItem exist in DB
	err := GetItemByID(id)
	if err == false {
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"updated": false, "error": "Record Not Found"}`)
	} else {
		completed, _ := strconv.ParseBool(r.FormValue("completed"))
		log.WithFields(log.Fields{"Id": id, "Completed": completed}).Info("Updating TodoItem")
		todo := &TodoItemModel{}
		db.First(&todo, id)
		todo.Completed = completed
		db.Save(&todo)
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"updated": true}`)
	}
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	// Get URL parameter from mux
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	// Test if the TodoItem exist in DB
	err := GetItemByID(id)
	if err == false {
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"deleted": false, "error": "Record Not Found"}`)
	} else {
		log.WithFields(log.Fields{"Id": id}).Info("Deleting TodoItem")
		todo := &TodoItemModel{}
		db.First(&todo, id)
		db.Delete(&todo)
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"deleted": true}`)
	}
}

func GetItemByID(Id int) bool {
	todo := &TodoItemModel{}
	result := db.First(&todo, Id)
	if result.Error != nil {
		log.Warn("TodoItem not found in database")
		return false
	}
	return true
}

func GetCompletedItems(w http.ResponseWriter, r *http.Request) {
	log.Info("Get completed TodoItems")
	completedTodoItems := GetTodoItems(true)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completedTodoItems)
}

func GetIncompleteItems(w http.ResponseWriter, r *http.Request) {
	log.Info("Get Incomplete TodoItems")
	IncompleteTodoItems := GetTodoItems(false)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(IncompleteTodoItems)
}

func GetTodoItems(completed bool) interface{} {
	var todos []TodoItemModel
	TodoItems := db.Where("completed = ?", completed).Find(&todos).Value
	return TodoItems
}

func PR(data ...interface{}) {
	color.New(color.FgWhite, color.BgBlack).Println("===========================================")
	color.Info.Println(data...)
	color.New(color.FgWhite, color.BgBlack).Println("===========================================")
}
