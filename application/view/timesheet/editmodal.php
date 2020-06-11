<?php

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This contains the html and JS for the edit event modal.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="KITS">
    <title>Edit Undertaken Work</title>

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <link type="text/css" rel="stylesheet" href="/css/frameworks/pure-min.css">

    <link type="text/css" rel="stylesheet" href="/css/style.css"/>

    <script src="/js/frameworks/jquery-1.12.2.min.js" type="text/javascript"></script>
    <script src="/js/frameworks/daypilot-all.min.js" type="text/javascript"></script>
</head>
<body>

<form id="editform" class="pure-form pure-form-stacked">
    <fieldset>

        <h3>Edit event</h3>
        <input type="hidden" id="id" name="id" value="<?php echo $event['id'] ?>" />
        <input type="hidden" id="start" name="start" value="<?php echo $event['start'] ?>" />
        <input type="hidden" id="end" name="end" value="<?php echo $event['end'] ?>" />

        <label for="project">Project:</label>
        <select class="pure-input-1" id="project" name="project">
            <?php
            foreach ($projects as $project) {
                $projectId = $project['projectID'];
                $projectName = $project['projectName'];

                if ($projectId == $event['projectID']) {

                    print "<option selected value='$projectId'>$projectName</option>";

                } else {

                    print "<option value='$projectId'>$projectName</option>";
                }
            }
            ?>
        </select>
        <br>
        <label for="comment">Comments:</label>
        <textarea style="min-height:150px" class="pure-input-1" id="comment" name="comment" placeholder="Optional comment"><?php echo $event['name'] ?></textarea>

        <br>
        <div class="pure-controls">
            <input type="submit" value="Save" class="pure-button pure-button-primary" />
            <a class="pure-button" href="javascript:close();">Cancel</a>
        </div>

    </fieldset>
</form>

<form id="deleteform">
    <input type="hidden" id="id" name="id" value="<?php echo $event['id']?>" />
    <input type="submit" value="Delete" class="pure-button pure-button-primary delete-event-btn" />
</form>

<script type="text/javascript">
    function close(result) {
        DayPilot.Modal.close(result);
    }

    $("#editform").submit(function (ev) {

        ev.preventDefault();

        // submit using AJAX
        var f = $("#editform");
        $.post("/timesheet/edit_event", f.serialize(), function (result) {
            close(eval(result));
        });

    });

    $(document).ready(function () {
        $("#comment").focus();
    });
</script>

<script type="text/javascript">
    function close(result) {
        DayPilot.Modal.close(result);
    }

    $("#deleteform").submit(function (ev) {

        ev.preventDefault();

        if (confirm("Are you sure?") == true) {

            // submit using AJAX
            var f = $("#editform");
            $.post("/timesheet/delete_event", f.serialize(), function (result) {
                close(eval(result));
            });
        }
    });
</script>
</body>
</html>
