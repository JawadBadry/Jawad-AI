const OPENROUTER_API_KEY = "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"; // ضع مفتاح API الخاص بك هنا    

const messagesContainer = document.getElementById("messages");
const historyContainer = document.getElementById("chatHistory");

loadHistory();

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function toggleSidebar() {
    document.getElementById("sidebar")
        .classList.toggle("hidden");
}

function newChat() {
    messagesContainer.innerHTML = `
        <div class="welcome">
            <h2>مرحباً بك في Jawad AI</h2>
            <p>اكتب أي سؤال للبدء</p>
        </div>
    `;
}

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const query =
        input.value.trim();

    if (!query) return;

    if (document.querySelector(".welcome")) {
        messagesContainer.innerHTML = "";
    }

    addMessage(query, "user");

    input.value = "";

    const aiElement =
        addMessage("جاري التفكير...", "ai");

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b:free",
                    messages: [
                        {
                            role: "system",
                            content: "أنت مساعد عربي اسمه Jawad AI. أجب بالعربية بشكل طبيعي."
                        },
                        {
                            role: "user",
                            content: query
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        //alert(JSON.stringify(data, null, 2));

        if (data.error) {
            aiElement.textContent =
                "حدث خطأ يمكنك اعاده المحاولة لاحقا او التحدث مع المبرمج على ايميله Jawadbadry8@gmail.com: " + data.error.message;
            return;
        }

        const answer =
            data?.choices?.[0]?.message?.content ||
            "لم يتم العثور على رد.";

        aiElement.textContent = answer;

        saveHistory(query);

    }
    catch (error) {

        console.error(error);

        aiElement.textContent =
            "فشل الاتصال بـ Jawad AI.";

    }

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}

function addMessage(text, type) {

    const div =
        document.createElement("div");

    div.className =
        `message ${type}`;

    div.textContent =
        text;

    messagesContainer.appendChild(div);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    return div;
}

function saveHistory(title) {

    let chats =
        JSON.parse(
            localStorage.getItem("jawad_history")
            || "[]"
        );

    if (!chats.includes(title)) {

        chats.unshift(title);

        if (chats.length > 20) {
            chats.pop();
        }

        localStorage.setItem(
            "jawad_history",
            JSON.stringify(chats)
        );

        loadHistory();
    }
}

function loadHistory() {

    historyContainer.innerHTML = "";

    const chats =
        JSON.parse(
            localStorage.getItem("jawad_history")
            || "[]"
        );

    chats.forEach(chat => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";

        item.textContent =
            chat;

        item.onclick = () => {

            document.getElementById("userInput")
                .value = chat;

        };

        historyContainer.appendChild(item);

    });

        function toggleSidebar() {
    document.querySelector(".sidebar")
        .classList.toggle("active");
}

}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.toggle("active");
    }
}
