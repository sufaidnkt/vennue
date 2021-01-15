const express = require("express");
// const app = express();
const router = express.Router(); // get an instance of the express Router

// var hook = require('../hook/preHook');
var login_controller = require('../controllers/login');
var product_controller = require('../controllers/products');



// middleware to use for all requests
// router.use(hook.preHook);

router.get('/', login_controller.index);

router.all('/login', login_controller.login);
router.get('/dashboard', /*login_controller.checkAuthentication,*/ login_controller.dashboard);
router.get('/logout', login_controller.logout);

router.get('/products',/* login_controller.checkAuthentication,*/ product_controller.productList);

router.get("/product/edit", /*login_controller.checkAuthentication,*/ product_controller.productEdit);
router.get("/product/edit/:pro_id", /*login_controller.checkAuthentication,*/ product_controller.productEdit);
router.post("/product/product-conf-submit", /*login_controller.checkAuthentication,*/ product_controller.productConfSave);

// router.get("/view-events", /*login_controller.checkAuthentication,*/ admin_controller.userEvenetView);

router.get("/add-events", /*login_controller.checkAuthentication,*/ login_controller.addNewEvents);
router.post("/events/events-submit", /*login_controller.checkAuthentication,*/ login_controller.eventConfSave);

	

// router.get('/view_profile', login_controller.view_profile);


module.exports = router;
