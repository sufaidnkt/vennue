
  $(document).ready(function() {
    $('.mining-distribute').click(function () {
      var id = this.id;
      swal({
        title: "Are you sure",
        text: "Are you sure you want to distribute coins?",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {
        setTimeout(function () {
          var url = "/admin/mining-calculate/"+id
          swal("Completed", "Coin distribution completed", "success");
          window.location = url;
        }, 2000);
      });
    });


    $(".xab-deposit-user").select2({
        placeholder: "Please select a user",
        allowClear: true,
        // minimumInputLength: 2,
        // minimumResultsForSearch: 10,
        ajax: {
            url: '/userlist-ajax',
            dataType: "json",
            type: "GET",
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    page: params.page || 1
                }
                return queryParameters;
            },
            processResults: function (data, params) {
                params.page = params.page || 1;

                return {
                    results: $.map(data.users, function (item) {
                        return {
                            text: item.username + " (" + item.uid + ")",
                            id: item.uid
                        }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.count
                    }
                };
            }
        }
    });








    

  });
