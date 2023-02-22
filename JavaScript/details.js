async function getDetails(){
                var date = document.getElementById("date").value;
                var starttime = document.getElementById("starttime").value;
                var endtime = document.getElementById("endtime").value;
                var queryStringurlvalue = decodeURIComponent(window.location.search);
                queryStringurlvalue = queryStringurlvalue.substring(1);
                var queries = queryStringurlvalue.split("para1=");
                var markervalue = queries[1].split("&&")
                var url = "http://localhost:3000/getStream/?streetName=" + markervalue[0] + "&area=" + markervalue[1] + "&date=" + date + "&time=" + starttime+ "&timeEnd=" + endtime;
                // document.getElementById("urlsrc").setAttribute("src", "http://localhost:3000/getStream/?streetName=" + streetname + "&area=" + area + "&date=" + date + "&time=" + starttime+ "&timeEnd=" + endtime,"_self");
                var queryString = "?para1=" + url ;
                window.location.href = "viewStream.html" + queryString;
    
}