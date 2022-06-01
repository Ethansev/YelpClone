//client-side validation script for new campgrounds
(function() {
    'use strict';

    bsCustomFileInput.init(); //custom file inputs are going to be initialized with basic js functionality
    
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName('validated-form');
      // Loops over them and prevents submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();