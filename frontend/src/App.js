import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; 

function App() {
  const[msg, setmsg] = useState("");
  const[namefield, setnamefield] = useState("")
  const[mailfrom, setmailfrom] = useState("")
  const[emails,setemails] = useState([])
  const[subj, setsubj] = useState("")
  const[status,setstatus] = useState(false)

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  function handleNamechange(evt){
    setnamefield(evt.target.value)
  }
  function handlemail(evt){
    setmailfrom(evt.target.value)
  }
  function subject(evt){
    setsubj(evt.target.value)
  }
  function handlechange(event) {
    setmsg(event.target.value);
  }
  function handlefileupload(event){
    const filess = event.target.files[0]
    console.log(filess)
    const reader = new FileReader()
    reader.onload = function(event){
    const data =  event.target.result
    const workbook = XLSX.read(data,{type: 'binary'})
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const emailList = XLSX.utils.sheet_to_json(worksheet,{header: "A"})
    const totalemails = emailList.map(function(item){return item.A})
    console.log(totalemails)
    setemails(totalemails)
}
    reader.readAsBinaryString(filess)
  }

  function sending() {
    setstatus(true)
    axios.post(`${backendUrl}/sendemail`,{msg:msg, namefield:namefield,mailfrom:mailfrom, subj:subj, emails:emails}, {withCredentials: true})
    .then(function(data){
      if(data.data === true){
        alert("sent successfully")
        setstatus(false)
      }else{
        alert("email failed")
        setstatus(false)
      }
    })
  }

  return (
    <div className="bg-slate-400 w-full min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative"> {/* min-h-screen and overflow-x-hidden */}
  <div className="w-full px-4 md:px-12 lg:px-20 py-12 flex flex-col md:flex-row justify-between items-start">
    <div className="md:w-1/2 text-left md:mt-0 lg:mt-64"> {/* Adjusted margin-top */}
      <h1 className="text-3xl mb-4 md:text-left font-bold">Mail Sender</h1>
      <p className="md:text-sm lg:text-lg">
        Enhance your communication with our Bulk Email Sender project. This tool simplifies the process of sending personalized emails to multiple recipients at once, making it ideal for businesses, marketing campaigns, and professional outreach, ensuring efficiency and effectiveness.
      </p>
    </div>

    <div className="md:w-1/2 bg-slate-300 p-4 md:p-6 rounded-lg shadow-lg mt-4 md:mt-0 space-y-4"> {/* Adjusted padding and margin-top */}
      <h1 className="lg:text-3xl font-bold text-center my-2 md:text-xl">Bulk Mail Sender</h1>
      <p className="text-gray-900 text-center mb-4 md:text-sm">
        Upload an Excel file containing email addresses and send bulk emails easily.
      </p>

      <input
        type="text"
        className="w-full p-1.5 border rounded-md outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base" // Added text size adjustments
        onChange={handleNamechange}
        value={namefield}
        placeholder="Enter sender name"
      />
      <input
        type="text"
        className="w-full p-1.5 border rounded-md outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
        onChange={handlemail}
        value={mailfrom}
        placeholder="Enter sender Email Id (From)"
      />
      <input
        type="file"
        className="w-full p-1.5 border rounded-md bg-white focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-1 file:outline-none text-sm md:text-base"
        onChange={handlefileupload}
      />
      <input
        type="text"
        className="w-full p-1.5 border rounded-md outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
        placeholder="Enter subject"
        onChange={subject}
        value={subj}
      />
      <textarea
        className="w-full p-1.5 border rounded-md outline-none resize-none h-24 focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
        placeholder="Enter your message"
        onChange={handlechange}
        value={msg}
      ></textarea>

      <p className="mt-4 text-gray-700 text-center text-sm md:text-base">
        Total number of emails in file: {emails.length}
      </p>

      <button
        className="w-full bg-blue-400 hover:bg-blue-700 text-white py-3 rounded-md font-medium mt-4 transition duration-300 text-sm md:text-base"
        onClick={sending}
      >
        {status ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
</div>
  );
}

export default App;
