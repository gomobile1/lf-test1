        var wordcounts = { };
        var countarr = [];
         $(document).ready(function(){
//            alert('doc ready');
            $('#getbutt1').bind('click', function(){
                getdata();
             });
         });

        function parseit( resp){
            var sarr = resp.toLowerCase().split(' ');

            for ( var ii = 0, ll = sarr.length; ii < ll; ii++ ){
                if ( ( sarr[ii].substring(0,1) !== "@" ) && (sarr[ii].trim().length > 0) ){
                    if (!wordcounts[sarr[ii]]) {
                        wordcounts[sarr[ii]] = 0;
                        countarr[countarr.length] = [ sarr[ii] , '0'];
                    }
                    ++wordcounts[sarr[ii]];
                    for (var j= 0,k = countarr.length ; j < k; j++ ) {
                        if ( sarr[ii] == countarr[j][0] ){
                            countarr[j][1] = parseInt(countarr[j][1]) + 1;
                        }
                    }
                }
            }
            return false;
        }
        function getdata(){
            var gotJSON = false;
            wordcounts = {};
            countarr = [];

            $.getJSON(document.getElementById('downloadlink').value,
                    function(result){

                        var info = result;
                        var tots = 0;
                        var totstop20 = 0;
                        gotJSON = true;

                        for ( key in info) {

                            var bhct = 0;
                            if ( (info[key].length) && ( info[key].length >= 0 )) {
                                for (i = 0, l = info[key].length; i < l ; i++ ){
                                    var infox =  info[key][i];
                                    for ( key1 in infox) {
                                        if ( key1 == "content") {
                                            if ( infox[key1]['bodyHtml'] ) {
                                                bhct++;
                                                document.getElementById('GOTSTUFF').innerHTML = infox[key1]['bodyHtml'];
                                                var yy = document.getElementById('GOTSTUFF').textContent;
                                                parseit(yy );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        countarr.sort();
                        for ( i=0; i < countarr.length; i++) {
                            document.getElementById('TABLEOFWORDSBYALPHA').innerHTML =
                                    document.getElementById('TABLEOFWORDSBYALPHA').innerHTML + '<li>'+ countarr[i][0] + ' ('+ countarr[i][1]  + ')</li>';
                        }
                        countarr.sort( function( a, b) {
                            return b[1] - a[1];
                        });
                        for ( i=0; i < countarr.length; i++) {
                            document.getElementById('TABLEOFWORDSBYCOUNT').innerHTML =
                                    document.getElementById('TABLEOFWORDSBYCOUNT').innerHTML + '<li>'+ countarr[i][0] + ' ('+ countarr[i][1]  + ')</li>';
                        }
                        var ctx = $("#myChart").get(0).getContext("2d");
                        ctx.canvas.width = 800;
                        ctx.canvas.height = 200;


                        var data = {
                            labels: [],
                            datasets: [
                                {
                                    fillColor: "rgba(151,187,205,0.5)",
                                    strokeColor: "rgba(151,187,205,1)",
                                    pointColor: "rgba(151,187,205,1)",
                                    pointStrokeColor: "#fff",
                                    data: []
                                }
                            ]
                        };
                        for ( i=0; i < countarr.length; i++) {
                            if ( i < 20 ){
                                data['labels'][i] = countarr[i][0] + " (" + countarr[i][1] + ")";
                                data['datasets'][0]['data'][i] = countarr[i][1];
                                totstop20 += countarr[i][1];
                            }
                            tots += countarr[i][1];
                        }


 //                       var myBarChart = new Chart(ctx).Bar(data);
                        var top20pct =  ( totstop20 / tots ) * 100;
                        document.getElementById('chart1label').innerHTML =
                                'Chart of Top 20 Words most commonly found with # of occurences (total words found: ' + countarr.length + ").<br/>"
                                + ' The Top 20 words had ' + totstop20 + ' occurences or ' + top20pct +  '% of the total:' + tots  + "occurrences.<br/>";


                        var myBarChart = new Chart(ctx).Line(data);
                        return false;
                    });

            setTimeout(function() {
                if (!gotJSON)
                {
                    // Handle error accordingly
                    alert("JSON data get timed out.");
                }
            }, 5000);
        }
