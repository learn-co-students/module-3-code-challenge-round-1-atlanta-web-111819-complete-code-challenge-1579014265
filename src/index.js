let IMAGE
const commentsURL = `https://randopic.herokuapp.com/comments/`

function getImageData(imageUrl) {
  return fetch(imageUrl)
          .then(res => res.json())
}

function deleteCommentFromBackend(commentsURL, commentId) {
  return fetch(commentsURL+`/${commentId}`, {method: 'DELETE'})
          .then(res => res.json())
}

function removeCommentFromDOM(commentId) {
  const commentItem = document.getElementById(commentId)
  commentItem.remove()
}

function clickDeleteButton(e) {
  const commentId = e.target.dataset.commentId
  deleteCommentFromBackend(commentsURL, commentId)
    .then(response => {
      if (response.message === 'Comment Successfully Destroyed') {
        removeCommentFromDOM(commentId)
      }
    })
}

function renderComment(comment, commentItem) {
  
  let li = document.createElement('li')

  const deleteButton = document.createElement('button')
  deleteButton.dataset.commentId = comment.id
  deleteButton.addEventListener('click', clickDeleteButton)
  deleteButton.textContent = 'Delete Comment'

  if (commentItem) {
    li = commentItem
  }

  li.textContent = comment.content
  li.dataset.id = comment.id
  li.dataset.imageId = comment.image_id

  if (comment.id !== undefined) {
    li.id = comment.id
  }

  li.appendChild(deleteButton)

  return li
}

function renderImage(image) {
  const img = document.querySelector('#image')
  img.src = image.url
  img.dataset.id = image.id

  const imgName = document.querySelector('#name')
  imgName.textContent = image.name

  const likes = document.querySelector('#likes')
  likes.textContent = image.like_count

  const commentList = document.querySelector('#comments')

  for (comment of image.comments) {
    const commentItem = renderComment(comment)
    commentList.appendChild(commentItem)
  }
}

function incrementLikes() {
  IMAGE.like_count += 1
  const likes = document.querySelector('#likes')
  likes.textContent = IMAGE.like_count
}

function postNewLike(likeURL, imageId) {

  messageBody = {"image_id": imageId}

  options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(messageBody)
  }

  return fetch(likeURL, options)
          .then(res => res.json())
}

function clickLikeButton(likeURL, imageId) {
  incrementLikes()
  postNewLike(likeURL, imageId)
}

function postNewComment(commentUrl, imageId, commentContent) {
  console.log(commentContent)
  const messageBody = {
    "image_id": imageId,
    content: commentContent
  }
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(messageBody)
  }

  return fetch(commentUrl, options)
          .then(res => res.json())
}

function addNewComment(commentContent) {
  const li = renderComment({content: commentContent})
  const commentList  = document.querySelector('#comments')
  commentList.appendChild(li)
  return li
}




document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4369

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  

  getImageData(imageURL).then(image => {
    IMAGE = image
    renderImage(image)
  })

  document.querySelector("#like_button").addEventListener('click', (e) => {
    clickLikeButton(likeURL, imageId)
  })

  document.querySelector('#comment_form').addEventListener('submit', (e) => {
    e.preventDefault()
    const content = e.target['comment'].value
    const li = addNewComment(content)
    e.target.reset()

    postNewComment(commentsURL, imageId, content)
    .then(comment => {
      console.log(comment)
      renderComment(comment, li)
    })
  })

})
