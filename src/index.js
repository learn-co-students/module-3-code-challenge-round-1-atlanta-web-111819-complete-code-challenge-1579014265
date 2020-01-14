document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4368 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch(imageURL)
  .then(resp => resp.json())
  .then(json => renderImage(json));

  let commentSub = document.getElementById("comment_form")
  commentSub.addEventListener("submit", addComment)

  let likeButton = document.getElementById("like_button")
  likeButton.addEventListener("click", addLike)
})

function renderImage(data){
  console.log(data)
  let img = document.getElementById("image")
  img.src = data.url 

  let title = document.getElementById('name')
  title.textContent = data.name 

  let likes= document.getElementById("likes")
  likes.textContent = data.like_count

  data.comments.forEach(comment => {
    renderComment(comment)
  })

}

function addComment(event){
  console.log(event.target)
  event.preventDefault()

  let comCon = event.target["comment"].value

  let com = {
    content: comCon,
    image_id: 4368
  }

  fetch(`https://randopic.herokuapp.com/comments/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(com)
  })
  .then(resp => resp.json())
  .then(json => renderComment(json)) 

  event.target.reset()
}

function renderComment(data){
  console.log(data)

  let content = data.content
  let commentArea = document.getElementById("comments")
  let li = document.createElement("li")
  li.textContent = content

  let delButton = document.createElement("button")
  delButton.textContent = "delete"
  delButton.dataset.comId = data.id
  delButton.addEventListener("click", deleteCom)

  li.appendChild(delButton)
  commentArea.appendChild(li)
}

function addLike(e){
  let likeSpan = document.getElementById("likes")
  let curLikes = likeSpan.textContent
  console.log(parseInt(curLikes)+1)
  likeSpan.textContent = parseInt(curLikes) + 1

  fetch(`https://randopic.herokuapp.com/likes/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      image_id: 4368
    })
  })
  .then(resp => resp.json())
  .then(json => console.log(json))
}

function deleteCom(e){
  console.log(e.target)

  let commId = e.target.dataset.comId
  console.log(e.target.parentElement)
  fetch(`https://randopic.herokuapp.com/comments/${commId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: commId})
  })
  .then(resp => resp.json())
  .then(json => {
    e.target.parentElement.remove()
  })
}