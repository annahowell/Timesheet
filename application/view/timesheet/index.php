<?php

/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This contains the html and JS for the main page where users enter their events.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
?>

<h2>Time sheet</h2>

<div class="Legend:">
    <p style="margin: 0 0 10px">Legend:</p>
    <table>
        <tbody>

        <?php
        // foreach through list of projects and generate the colour legend accordingly
        $count = 0;
        foreach ($projects as $project) {
            $projectID = $project['projectID'];
            $projectName = $project['projectName'];
            $projectDescription = $project['projectDescription'];
            $projectColour = $project['projectColour'];
            $projectClientName = $project['clientName'];

            if ($count % 2 == 0) {
                print   "<tr>";
            }
            print   "<td><span style='color:$projectColour'>&#11044;</span></td>
                     <td><span style='margin:0 16px 0 10px'>$projectName</span></td>";

            if ($count % 2 == 1) {
                print   "</tr>";
            }
            $count++;
            //print $count;
        }
        ?>
        </tbody>
    </table>
</div>


<div style="margin: 32px 0 " id="dp"></div>


<p style="font-size:13px">
    You can add items by clicking an empty box, and you can drag over multiple horiztonal boxes to create longer events.
    <br><br>
    Clicking on an existing work box lets you edit it, you can drag the bits to the left and right of it to resize it.
    <br><br>
    You can move work boxes around so long as they don't overlap each other.
    <br><br>
    Changing the project the work box belongs to changes its colour strip so it's easier to read what's what.
</p>

<script type="text/javascript">

    // Setup day pilot caldendar conf
    var dp = new DayPilot.Scheduler("dp");
    dp.messageBarPosition = "Bottom";

    dp.viewType = "Days";
    dp.startDate = new DayPilot.Date().firstDayOfWeek().addDays(1);
    dp.startDateNum = new DayPilot.Date().firstDayOfWeek().addDays(1).toString("d");
    dp.endDateNum = new DayPilot.Date().firstDayOfWeek().addDays(7).toString("d");

    dp.cellGroupBy = "Hour";
    dp.days = 7;

    dp.scale = "CellDuration";
    dp.cellDuration = 30;

    dp.businessBeginsHour = 8;
    dp.businessEndsHour = 20;
    dp.showNonBusiness = false;

    dp.cellWidthSpec = 'Auto';
    dp.rowHeaderWidthAutoFit = true;
    dp.allowEventOverlap = false;

    dp.rowHeaderColumns = [
        { title: '&nbsp;&nbsp;&nbsp;&nbsp;Date', width: '60'},
    ];

    dp.timeHeaders = [
        { groupBy: "Day", format: dp.startDateNum + " - "  + dp.endDateNum+ " MMMM yyyy"},
        { groupBy: "Hour", format: "htt"},
        { groupBy: "Cell"}
    ];


    dp.locale = "en-gb";

    dp.onBeforeCellRender = function(args) {
        if (args.cell.y % 2) {
            args.cell.backColor = "#f9f9f9"; // Even numbered
        }
        else {
            args.cell.backColor = "#ffffff";
        }
    };

    // --------------------------------------------------------------------

    dp.onTimeRangeSelected = function (args) {

        var modal = new DayPilot.Modal({
            width: 300,
            dragDrop: false
        });
        modal.data = "my data";

        modal.onClosed = function(args) {
            dp.clearSelection();
            var result = args.result;
            if (result && result.status === "OK") {
                loadEvents();
                dp.message(result.message);
            }
        };
        modal.showUrl("/timesheet/add_modal/" + args.start + "/" + args.end);

    };

    // --------------------------------------------------------------------

    dp.onEventClick = function(args) {

        var modal = new DayPilot.Modal({
            width: 300,
            dragDrop: false
        });

        modal.onClosed = function(args) {
            // reload all events
            var result = args.result;
            if (result && result.status === "OK") {
                loadEvents();
            }
        };
        modal.showUrl("/timesheet/edit_modal/" + args.e.id());
    };

    // --------------------------------------------------------------------

    dp.onEventMoved = function (args) {

        $.post("/timesheet/update_event/",
            {
                id: args.e.id(),
                newStart: args.newStart.toString(),
                newEnd: args.newEnd.toString()
            },
            function() {
                dp.message("Moved " + args.e.id());
            });
    };

    // --------------------------------------------------------------------

    dp.onEventResized = function (args) {

        $.post("/timesheet/resize_event/",
            {
                id: args.e.id(),
                newStart: args.newStart.toString(),
                newEnd: args.newEnd.toString()
            },
            function() {
                dp.message("Resized " + args.e.id());
            });
    };

    // --------------------------------------------------------------------

    dp.init();
    loadEvents();

    function loadEvents() {
        var start = dp.startDate;
        var end = dp.startDate.addDays(dp.days);

        $.post("/timesheet/get_events/",
            {
                start: start.toString(),
                end: end.toString()
            },
            function(data) {
            console.log(data);
                dp.events.list = data;
                dp.update();
            }
        );
    }
</script>