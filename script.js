document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://disease.sh/v3/covid-19/all"; // API-tik COVID-19 datuak lortzen

    try {
        // APIra eskaera egiten
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);

        // Datu garrantzitsuak ateratzen
        const cases = data.cases;
        const deaths = data.deaths;
        const recovered = data.recovered;
        const todayCases = data.todayCases;
        const todayDeaths = data.todayDeaths;
        const todayRecovered = data.todayRecovered;

        // Barra-grafikoa: Kasu, heriotza eta sendatuak
        const ctx1 = document.getElementById("barChart").getContext("2d");
        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Kasuak", "Heriotzak", "Sendatuak"],
                datasets: [{
                    label: "COVID-19 Datu Globalak",
                    data: [cases, deaths, recovered],
                    backgroundColor: ["blue", "red", "green"],
                }],
            },
        });

        // Pie-grafikoa: Eguneko kasuak, heriotzak eta sendatuak
        const ctx2 = document.getElementById("pieChart").getContext("2d");
        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: ["Kasuak Gaur", "Heriotzak Gaur", "Sendatuak Gaur"],
                datasets: [{
                    data: [todayCases, todayDeaths, todayRecovered],
                    backgroundColor: ["orange", "red", "green"],
                }],
            },
        });

        // Linea-grafikoa: COVID-19ren bilakaera
        const ctx3 = document.getElementById("lineChart").getContext("2d");
        new Chart(ctx3, {
            type: "line",
            data: {
                labels: ["Kasuak", "Heriotzak", "Sendatuak"],
                datasets: [{
                    label: "Eboluzioa COVID-19",
                    data: [cases, deaths, recovered],
                    borderColor: "blue",
                    fill: false,
                }],
            },
        });

        // PDF-a sortzeko botoia
        document.getElementById("generatePdf").addEventListener("click", function () {
            getBase64Image("img/logo.png", function (base64Image) {
                const doc = new window.jspdf.jsPDF();
                generarPDF(doc, base64Image);
            });
        });

        //  Irudia Base64 bihurtzeko funtzioa
        function getBase64Image(url, callback) {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL("image/png");
                callback(dataURL);
            };
            img.onerror = function () {
                console.warn("Ezin izan da logotipoa kargatu. PDF irudirik gabe sortuko da.");
                callback(null);
            };
        }

        // PDF txostena sortzeko funtzioa
        function generarPDF(doc, base64Image) {
            if (base64Image) {
                doc.addImage(base64Image, "PNG", 160, 10, 30, 30);
            }

            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("📄 COVID-19 Txostena", 10, 20);

            doc.setFontSize(14);
            doc.setFont("helvetica", "italic");
            doc.text("COVID-19 pandemiak mundu mailan duen egoeraren laburpena", 10, 35);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Kasu Totala:", 10, 50);
            doc.setFont("helvetica", "normal");
            doc.text(`${cases.toLocaleString()}`, 60, 50);

            doc.setFont("helvetica", "bold");
            doc.text("Heriotza Totala:", 10, 60);
            doc.setFont("helvetica", "normal");
            doc.text(`${deaths.toLocaleString()}`, 60, 60);

            doc.setFont("helvetica", "bold");
            doc.text("Sendatu Totala:", 10, 70);
            doc.setFont("helvetica", "normal");
            doc.text(`${recovered.toLocaleString()}`, 60, 70);

            doc.setFont("helvetica", "bold");
            doc.text("Kasuak Gaur:", 10, 80);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayCases.toLocaleString()}`, 60, 80);

            doc.setFont("helvetica", "bold");
            doc.text("Heriotzak Gaur:", 10, 90);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayDeaths.toLocaleString()}`, 60, 90);

            doc.setFont("helvetica", "bold");
            doc.text("Sendatuak Gaur:", 10, 100);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayRecovered.toLocaleString()}`, 60, 100);

            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.text("Iturria: disease.sh API", 10, 120);

            doc.save("covid19_txostena.pdf");
        }
    } catch (error) {
        console.error("Errorea APItik datuak lortzean", error);
    }
});
