<?php

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This contains the html and JS for the login page.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */

if(isset($_SESSION['user']) && $_SESSION['user'] != "")
{

header('Location: /timesheet'); //redirect URL
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="KITS">
    <title>KITS Login</title>

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <link type="text/css" rel="stylesheet" href="/css/frameworks/pure-min.css">

    <link type="text/css" rel="stylesheet" href="/css/style.css"/>

    <script src="/js/frameworks/jquery-1.12.2.min.js" type="text/javascript"></script>
</head>
<body>

<div style="width:300px;height:320px;margin-top:-160px;margin-left:-150px;position:absolute;top:50%;left:50%">

    <form id="loginform" class="pure-form pure-form-stacked">
        <fieldset>
            <legend>Employee Login</legend>
            <br>
            <label for="username">Username:</label>
            <input required class="pure-input-1" id="username" name="username" type="text" placeholder="Username">
            <br>
            <label for="password">Password:</label>
            <input required class="pure-input-1" id="password" name="password" type="password" placeholder="Password">
            <br>
            <input type="submit" value="Login" class="pure-button pure-button-primary" />

            <span id="submit-error"></span>
        </fieldset>
    </form>
</div>

<script type="text/javascript">

    $("#loginform").submit(function (ev) {

        ev.preventDefault();

        // submit using AJAX
        var f = $("#loginform");
        $.post("/login/go", f.serialize(), function (result) {
            console.log(result["message"]);
            $("#submit-error").html(result["message"]);
            if (result["success"] == 1) {
                $(location).attr('href', '/timesheet');
            }
        });

    });

    $(document).ready(function () {
        $("#username").focus();
    });
</script>

</body>
</html>
