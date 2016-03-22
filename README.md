# Writing a validation plugin using jQuery Boilerplate
Using a **data-validate** attribute in the input tag, some rules available to use: **required**, **email**, **phone**, **minlength**, **maxlength**, **confirmpassword** then add the **.testValidate** class, add a **data-name** attribute to name your field for errors, and you're done.
##HTML
`<input type="email" class="testValidate" data-validate="required,email" data-name="email">`

##Javascript
```javascript
$(function () {
    $("#register-form").testValidate({
        submitHandler: function (form) {
            form.submit();
        }
    });
});
```
##Required Field
`<input type="email" class="testValidate" data-validate="required" data-name="email">`

##Email Field
`<input type="email" class="testValidate" data-validate="email" data-name="email">`

##Phone Field
`<input type="email" class="testValidate" data-validate="phone" data-name="email">`

##Min Length 
`<input type="password" class="testValidate" data-validate="minlength=6" data-name="password">`

##Max Length
`<input type="password" class="testValidate" data-validate="password" data-name="password">`

##Confirm Password
`<input type="password" class="testValidate" data-validate="confirmpassword" data-name="password">`

##Captures
![Capture 1](/captures/capture1.png)

![Capture 2](/captures/capture2.png)
