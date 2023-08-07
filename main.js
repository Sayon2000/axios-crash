//Axios globals
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST

async function getTodos() {

  axios.get('https://jsonplaceholder.typicode.com/todos/1')
    .then(function (response) {
      // handle success
      console.log(response);
      console.log(response.data.userId);
      return response
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

  let response = await axios.get('https://jsonplaceholder.typicode.com/todos', {
    params: {
      _limit: 5
    },
    timeout : 5000
  })
  showOutput(response)



}

// POST REQUEST
async function addTodo() {
  console.log('POST Request');
  let res = await axios.post('https://jsonplaceholder.typicode.com/todos',{
    title : 'New Title',
    completed : true
  })
  showOutput(res)
}

// PUT/PATCH REQUEST
async function updateTodo() {
  try{


  // let res = await axios.patch('https://jsonplaceholder.typicode.com/todos/2',{
  //   title : 'New Title',
  //   completed : true
  // })
  let res = await axios({
    method :'patch',
    baseURL : 'https://jsonplaceholder.typicode.com/todos/2',
    data :{
      title : 'New Title',
    completed : true
    }
  })
  showOutput(res)
}catch(e){
  console.log(e)
}
}

// DELETE REQUEST
function removeTodo() {

  axios.delete('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {showOutput(response)})
  .catch(err => console.log(err))
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5') , axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')]).then(
    axios.spread((todos, posts)=>{
    showOutput(todos)
    console.log(posts)
  }))
  .catch(err => console.log(err))
}

// CUSTOM HEADERS
async function customHeaders() {
  let res = await axios.post('https://jsonplaceholder.typicode.com/todos',{
    title : 'Custom Title',
    completed : true
  },{
    headers :{
      'Content-Type' : 'application/json',
      'Authorization' : 'custom-token'
    }
  })
  showOutput(res)
}

// TRANSFORMING REQUESTS & RESPONSES
async function transformResponse() {
  const options ={
    method :'POST',
    baseURL :'https://jsonplaceholder.typicode.com/todos',
    data :{
      title : 'Transformed Title',
      completed : true
    },
    // transformResponse : [function (data){
    //   // data = JSON.parse(data)
    //   // data.title = data.title.toUpperCase()

    //   return data
    // }]
    transformResponse : axios.defaults.transformResponse.concat(data =>{
      data.title = data.title.toUpperCase()

      return data
    })
  }
  let res = await axios(options)
  showOutput(res)
}

// ERROR HANDLING
function errorHandling() {
  axios.get('https://jsonplaceholder.typicode.com/todoss',{
    validateStatus : function(status){
      return status < 500;
    }
  })
  .then(function (response) {
    // handle success
    console.log(response);
    console.log(response.data.userId);
    showOutput(response)

  })
  .catch(function (error) {
    // handle error

    if(error.response){
      if(error.response.status === 404)
        alert(`Error : ${error.response.config.url} not found`)
    }
  })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios.get('https://jsonplaceholder.typicode.com/todos',{
    cancelToken : source.token
  })
  .then(function (response) {
    // handle success
    showOutput(response)
  })
  .catch(function (thrown) {
    // handle error

    if(axios.isCancel(thrown)){

      console.log(thrown.message)
    }

    
  })
  if(true){
    source.cancel('Request cancelled')
  }

}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  config =>{
    console.log(`${config.method} request sent to ${config.url} at ${new Date().toLocaleTimeString()}`)
    return config
  },error =>{
    console.log(error)
    // return Promise.reject(error)
  }
)

// AXIOS INSTANCES

const axiosInstance = axios.create({
  baseURL : 'https://jsonplaceholder.typicode.com'
});
// axiosInstance.get('/comments?_limit=5').then(res => showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
