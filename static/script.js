document.addEventListener("DOMContentLoaded", function () {
    const serverStatus = "Online";  // Example status (this should be dynamic)

    const statusCircle = document.getElementById("server-status-circle");
    const statusText = document.getElementById("server-status-text");

    if (serverStatus === "Online") {
        statusCircle.style.backgroundColor = "green";
        statusText.textContent = "Server is Online";
    } else {
        statusCircle.style.backgroundColor = "red";
        statusText.textContent = "Server is Offline";
    }

    document.getElementById("send-btn").addEventListener("click", function () {
        const responseElement = document.getElementById("response");
        const ip = document.getElementById("ip").value;
        const port = document.getElementById("port").value;
        const protocol = document.getElementById("protocol").value;
        const totalRequests = document.getElementById("total-requests").value || 500;

        if (!ip || !port || !totalRequests) {
            responseElement.textContent = "Please fill in all the fields.";
            return;
        }

        responseElement.textContent = "";

        fetch("/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ip,
                port,
                protocol,
                total_requests: totalRequests,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "processing") {
                responseElement.textContent = "Requests are being sent.";
            } else if (data.status === "completed") {
                responseElement.textContent = "All requests have been sent.";
            } else {
                responseElement.textContent = `Error: ${data.message}`;
            }
        })
        .catch((err) => {
            responseElement.textContent = "Error: Failed to send request.";
        });
    });
});
