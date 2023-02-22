
            const vidObject1 = document.getElementById('src1');
            const source1 = document.createElement('source');
            source1.setAttribute('src', 'url');
            source1.setAttribute('type', 'video/mp4');
            vidObject1.appendChild(source1);

            const vidObject2 = document.getElementById('src2');
            const source2 = document.createElement('source');
            source2.setAttribute('src', 'url');
            source2.setAttribute('type', 'video/mp4');
            vidObject2.appendChild(source2);

            const vidObject3 = document.getElementById('src3');
            const source3 = document.createElement('source');
            source3.setAttribute('src', 'url');
            source3.setAttribute('type', 'video/mp4');
            vidObject3.appendChild(source3);

            const vidObject4 = document.getElementById('src4');
            const source4 = document.createElement('source');
            source4.setAttribute('src', 'url');
            source4.setAttribute('type', 'video/mp4');
            vidObject4.appendChild(source4);

        //     document.getElementById("start1").onclick = function(){
        //         myfunction()
        //     }
        //     function myfunction(){
        //         if ("WebSocket" in window) {
        //         var ws = new WebSocket("ws://localhost:57252/");

        //         ws.onopen = function () {
        //             ws.send("Hi, from the client.");
        //         }
        //     }
        // }