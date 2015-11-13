var CommentBox = React.createClass({
  getInitialState: function () {
    return { data: [] }
  },

  handleCommentSubmit: function (comment) {
    var _this = this
    var comments = this.state.data

    comment.id = Date.now()

    var newComments = comments.concat(comment)

    this.setState({ data: newComments })

    $.post(this.props.url, comment)
      .then(function (data) {
        _this.setState({ data })
      })
      .fail(function (xhr, status, err) {
        console.error(_this.props.url, stats, err.toString());
      })
  },

  loadCommentsFromServer: function () {
    var _this = this

    $.get(this.props.url)
      .then(function (data) {
        _this.setState({ data })
      })
      .fail(function (xhr, status, data) {
        console.error(_this.props.url, stats, err.toString());
      })
  },

  componentDidMount: function () {
    this.loadCommentsFromServer()
    setInterval(this.loadCommentsFromServer, this.props.interval)
  },

  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
})

var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault()

    var author = this.refs.author.value.trim()
    var text = this.refs.text.value.trim()

    if (!text || !author){
      return alert('Please fill out the form')
    }

    this.props.onCommentSubmit({
      author,
      text
    })

    this.refs.author.value = ''
    this.refs.text.value = ''

    return
  },

  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your Name" ref="author"/>
        <input type="text" placeholder="Say somethings...." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    )
  }
})

var Comment = React.createClass({
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), {
      sanitize: true
    })
    return { __html: rawMarkup }
  },

  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()}/>
      </div>
    )
  }
})

ReactDOM.render(<CommentBox url="/api/comments" interval={2000} />, 
$('#content')[0]) //JQ gives us an array, so we tell it to get the 0 index of the array