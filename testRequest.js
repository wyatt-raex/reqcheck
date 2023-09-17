//Test Cases for API Requests
fetch("http://localhost:5000/api/db/login")
.then(function(res){ return res.json(); })
.then(function(data){ console.log(data) });

fetch("http://localhost:5000/api/db/hardware/graphics")
.then(function(res){ return res.json(); })
.then(function(data){ console.log(data) });

fetch("http://localhost:5000/api/db/hardware/processor")
.then(function(res){ return res.json(); })
.then(function(data){ console.log(data) });