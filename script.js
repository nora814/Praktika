document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://disease.sh/v3/covid-19/all"; // API elegida (Datos globales de COVID-19)

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);

        // Extraer datos clave para los gráficos
        const cases = data.cases;
        const deaths = data.deaths;
        const recovered = data.recovered;
        const todayCases = data.todayCases;
        const todayDeaths = data.todayDeaths;
        const todayRecovered = data.todayRecovered;
        const active = data.active;
        const critical = data.critical;
        const affectedCountries = data.affectedCountries;

        // Renderizar gráficos con Chart.js
        const ctx1 = document.getElementById("barChart").getContext("2d");
        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Casos", "Muertes", "Recuperados"],
                datasets: [{
                    label: "COVID-19 Datos Globales",
                    data: [cases, deaths, recovered],
                    backgroundColor: ["blue", "red", "green"],
                }],
            },
        });

        // Convertir imagen a Base64 para evitar problemas de carga
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
                let dataURL = canvas.toDataURL("image/png"); // Asegúrate de usar "image/png"
                callback(dataURL);
            };
            img.onerror = function () {
                console.warn("No se pudo cargar el logo. Generando PDF sin imagen.");
                callback(null);
            };
        }

        document.getElementById("generatePdf").addEventListener("click", function () {
            getBase64Image("logo.png", function (base64Image) {
                const doc = new window.jspdf.jsPDF();
                generarPDF(doc, base64Image);
            });
        });

        function generarPDF(doc, base64Image) {
            if (base64Image) {
                doc.addImage(base64Image, "PNG", 160, 10, 30, 30);
            }

            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("📄 Informe COVID-19 Global", 10, 20);

            doc.setFontSize(14);
            doc.setFont("helvetica", "italic");
            doc.text("Resumen de la situación global de la pandemia COVID-19", 10, 35);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Casos Totales:", 10, 50);
            doc.setFont("helvetica", "normal");
            doc.text(`${cases.toLocaleString()}`, 60, 50);

            doc.setFont("helvetica", "bold");
            doc.text("Muertes Totales:", 10, 60);
            doc.setFont("helvetica", "normal");
            doc.text(`${deaths.toLocaleString()}`, 60, 60);

            doc.setFont("helvetica", "bold");
            doc.text("Recuperados Totales:", 10, 70);
            doc.setFont("helvetica", "normal");
            doc.text(`${recovered.toLocaleString()}`, 60, 70);

            doc.setFont("helvetica", "bold");
            doc.text("Casos Hoy:", 10, 80);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayCases.toLocaleString()}`, 60, 80);

            doc.setFont("helvetica", "bold");
            doc.text("Muertes Hoy:", 10, 90);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayDeaths.toLocaleString()}`, 60, 90);

            doc.setFont("helvetica", "bold");
            doc.text("Recuperados Hoy:", 10, 100);
            doc.setFont("helvetica", "normal");
            doc.text(`${todayRecovered.toLocaleString()}`, 60, 100);

            doc.setFont("helvetica", "bold");
            doc.text("Casos Activos:", 10, 110);
            doc.setFont("helvetica", "normal");
            doc.text(`${active.toLocaleString()}`, 60, 110);

            doc.setFont("helvetica", "bold");
            doc.text("Casos Críticos:", 10, 120);
            doc.setFont("helvetica", "normal");
            doc.text(`${critical.toLocaleString()}`, 60, 120);

            doc.setFont("helvetica", "bold");
            doc.text("Países Afectados:", 10, 130);
            doc.setFont("helvetica", "normal");
            doc.text(`${affectedCountries.toLocaleString()}`, 60, 130);

            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.text("Fuente: disease.sh API", 10, 150);

            doc.save("informe_covid19.pdf");
        }
    } catch (error) {
        console.error("Error al obtener datos de la API", error);
    }
});