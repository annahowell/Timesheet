<?php
/**
* Anna Thomas
* s4927945@bournemouth.ac.uk
* May 2017
* Admin controller
*
* This contains the footer html and JS which is appended to the end of each generated page
*
* Each function is lightly commented with the first few functions being more heavily commented due to time constraints
* some degree of code repetition.
*
*/
?>

    </div>
</div>

<script type="text/javascript">
    $(document).ready(function(){

        $(".menu-link").click(function(e){

            $("body").toggleClass("menu-open");
        });
    });
</script>
<script type="text/javascript">
    $(window).resize(function() {
        //if($(window).width() > 48em) {
            $("body").removeClass("menu-open");
        //}
    });
</script>

</body>
</html>
