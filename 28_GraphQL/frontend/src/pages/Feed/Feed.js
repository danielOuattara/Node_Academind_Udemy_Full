import React, { Component, Fragment } from "react";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    const graphqlQuery = {
      query: `
        query {
          getUserStatus 
        }`,
    };
    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ status: resData.data.getUserStatus });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }

    const graphqlQuery = {
      query: `
        query FetchPostsQuery($page: Int!){
          getAllPosts(page: $page){
            posts {
              _id
              title
              imageUrl
              content
              creator{
                name
              }
              createdAt
            }
            totalPosts
          }
        }`,
      variables: {
        page,
      },
    };

    // n°1: complete url
    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Error in getting posts!");
        }
        this.setState({
          posts: resData.data.getAllPosts.posts.map((item) => ({
            ...item,
            imagePath: item.imageUrl,
          })),
          totalPosts: resData.data.getAllPosts.totalPosts,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    const graphqlQuery = {
      query: `
        mutation UpdateUserStatusQuery($userNewStatus: String!) {
          updateUserStatus(status: $userNewStatus) 
        }`,
      variables: {
        userNewStatus: this.state.status,
      },
    };
    event.preventDefault();
    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Fetching posts failed!");
        }
        console.log(resData);
        // this.setState({ status: resData.data.updateUserStatus });
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = {
        ...prevState.posts.find((p) => p._id === postId),
      };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });

    const formData = new FormData();
    formData.append("image", postData.image);

    if (this.state.editPost) {
      formData.append("oldPath", this.state.editPost.imagePath);
    }

    fetch("http://localhost:8080/post-image", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((resData) => {
        const imageUrl = resData.filePath || "undefined";
        let graphqlQuery = {
          query: `
            mutation CreatePostQuery(
                $title: String!, 
                $content: String!, 
                $imageUrl: String!
              ) {
              createPost(
                postInput: {
                  title: $title, 
                  content: $content, 
                  imageUrl: $imageUrl
                }
              ) {
                _id 
                title 
                content  
                imageUrl 
                creator {
                  name
                } 
                createdAt 
              }
            }`,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
          },
        };

        if (this.state.editPost) {
          graphqlQuery = {
            query: `
            mutation UpdatePostQuery(
                $id: ID!, 
                $title: String!, 
                $content: String!, 
                $imageUrl: String!
            ) {
              updatePost(
                id: $id,
                postInput: {
                  title: $title, 
                  content: $content, 
                  imageUrl: $imageUrl
                }
              ) {
                _id 
                title 
                content  
                imageUrl 
                creator {
                  name
                } 
                createdAt 
                updatedAt
              }
            }`,
            variables: {
              id: this.state.editPost._id,
              title: postData.title,
              content: postData.content,
              imageUrl: imageUrl,
            },
          };
        }

        // N°2: change URL & other params
        return fetch("http://localhost:8080/graphql", {
          method: "POST",
          body: JSON.stringify(graphqlQuery),
          headers: {
            Authorization: `Bearer ${this.props.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((resData) => {
            if (resData.errors && resData.errors[0].status === 400) {
              throw new Error(resData.errors[0].error.message);
            }
            if (resData.errors) {
              throw new Error("Error in creating new post!");
            }

            let mutation = "createPost";
            if (this.state.editPost) {
              mutation = "updatePost";
            }

            const post = {
              _id: resData.data[mutation]._id,
              title: resData.data[mutation].title,
              content: resData.data[mutation].content,
              creator: resData.data[mutation].creator,
              createdAt: resData.data[mutation].createdAt,
              imagePath: resData.data[mutation].imageUrl,
            };
            this.setState((prevState) => {
              let updatedPosts = [...prevState.posts];
              let updatedTotalPosts = prevState.totalPosts;
              if (prevState.editPost) {
                const postIndex = prevState.posts.findIndex(
                  (item) => item._id === prevState.editPost._id,
                );
                updatedPosts[postIndex] = post;
              } else {
                updatedTotalPosts += 1;
                if (prevState.posts.length >= 2) {
                  updatedPosts.pop();
                }
                updatedPosts.unshift(post);
              }
              return {
                posts: updatedPosts,
                isEditing: false,
                editPost: null,
                editLoading: false,
                totalPosts: updatedTotalPosts,
              };
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              isEditing: false,
              editPost: null,
              editLoading: false,
              error: err,
            });
          });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    console.log(this.state.posts);
    this.setState({ postsLoading: true });
    let graphqlQuery = {
      query: `             
      mutation DeletePostQuery($id: ID!) {
        deletePost(id: $id)
      }`,
      variables: {
        id: postId,
      },
    };

    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Deleting the post failed!");
        }
        console.log(resData);
        this.loadPosts();
        // this.deletePost(resData.data.deletePost);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  // deletePost = (postId) => {
  //   console.log(postId, typeof postId);
  //   this.setState((prevState) => {
  //     const updatedPosts = [...prevState.posts];
  //     updatedPosts.filter((item) => item._id !== postId);
  //     console.log("updatedPosts  = ", updatedPosts);
  //     return { posts: updatedPosts, postsLoading: false };
  //   });
  // };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString("en-US")}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
