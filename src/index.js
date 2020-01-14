document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 1 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/4370`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  //Fetch Image
  renderImage()

  //Even Listeners
  const likeBtn = document.querySelector('#like_button')
  likeBtn.addEventListener('click', addLike)

  const commentForm = document.querySelector('#comment_form')
  commentForm.addEventListener('submit', addComment)
   
})

function renderImage() {
fetch("https://randopic.herokuapp.com/images/4370")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data)
      let img = document.querySelector('#image')
      img.src = data.url

      let name = document.querySelector('#name')
      name.innerHTML = data.name

      let likes = document.querySelector('#likes')
      likes.innerHTML = data.like_count

      render_comments(data)
      console.log(img)
    })
  }

 function render_comments(data) {
   let commenList = document.querySelector('#comments')
   data.comments.forEach(function(comment){
     let li = document.createElement('li')
     li.innerHTML = comment.content
     commenList.appendChild(li)
   })
 }

 function addLike(e) {
  let likesCount = document.querySelector('#likes').innerHTML
  console.log(likesCount)
  
  //Fetch Post
  fetch("https://randopic.herokuapp.com/likes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_id : 4370,
      like_count : likesCount + 1
    }),
  })
  .then((response) => console.log(response.json()))
  .then((data) => {
  console.log('Success:', data);
  let likeTotal = document.querySelector('#likes')
  likeTotal.innerHTML = parseInt(likes.innerHTML) + 1
})
  .catch((error) => {
   console.error('Error:', error);
});

 }

 function addComment(e) {
   e.preventDefault()
   let commenList = document.querySelector('#comments')
   let li = document.createElement('li')
   let newComment = document.querySelector('#comment_input')
   const newEntry = {
    
    "content": newComment.value,
    "image_id": 1,
   }
   fetch("https://randopic.herokuapp.com/comments", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  })
  .then((response) => console.log(response.json()))
  .then((data) => {
    let commenList = document.querySelector('#comments')
    let li = document.createElement('li')
    let newComment = document.querySelector('#comment_input')
 console.log(newComment)
    li.innerHTML = newComment.value
    console.log(newComment)
    commenList.appendChild(li)
})


   

 }