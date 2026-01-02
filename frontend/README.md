# SyncBoard 🎨

**SyncBoard** is a real-time collaborative whiteboard that allows distributed teams to sketch ideas on a shared infinite canvas. It demonstrates advanced frontend state management and low-latency communication.

![Demo Screenshot](https://dummyimage.com/800x500/000/fff&text=SyncBoard+Demo+Screenshot)
*(Tip: Take a screenshot of two side-by-side windows drawing together and put it here!)*

## ✨ Key Features
* **Live Multi-User Drawing:** See strokes from other users appear instantly.
* **Conflict-Free State:** Uses an event-driven model to merge drawing paths from multiple sources without locking the UI.
* **High Performance:** Optimized React rendering using `React Konva` layers to separate static and dynamic elements.

## 🛠 Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS
* **Graphics:** HTML5 Canvas API (via React Konva)
* **Real-Time:** SockJS, STOMP Client (WebSockets)
* **Backend:** Spring Boot (Message Broker)

## 🚀 How to Run Locally

### 1. Start the Backend (The Hub)
```bash
cd backend
mvn spring-boot:run
```
Server starts on port 8080

2. Start the Frontend
```bash
   cd frontend
   npm install
   npm run dev
```
Open http://localhost:5173 in multiple browser tabs.

🧠 Engineering Spotlight: Race Conditions
Handling real-time updates in React is tricky because state updates are asynchronous.

Problem: If a WebSocket message arrives while React is re-rendering, the drawing might jitter or disappear.

Solution: I implemented a Functional State Update pattern (setLines(prev => [...prev, newLine])) to ensure that incoming WebSocket events always append to the latest version of the canvas state, regardless of render timing

---

### **3. Optional: One "Quick Win" Feature**

If you want to add *one small thing* to make it look even cooler before you finish, add a **Color Picker**.

**In `Board.jsx`:**
1.  Add state: `const [color, setColor] = useState('black');`
2.  Update `handleMouseDown` to use this color: `color: color`.
3.  Add a simple UI above the canvas:

```jsx
<div className="flex gap-2 mb-2">
  <button onClick={() => setColor('black')} className="w-8 h-8 bg-black rounded-full border-2 border-white ring-2 ring-gray-300"></button>
  <button onClick={() => setColor('red')} className="w-8 h-8 bg-red-500 rounded-full border-2 border-white ring-2 ring-gray-300"></button>
  <button onClick={() => setColor('blue')} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white ring-2 ring-gray-300"></button>
</div>