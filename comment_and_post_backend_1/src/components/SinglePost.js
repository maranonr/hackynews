import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, withRouter } from "react-router-dom";

import { deleteComment, selectPosts } from "../slices/posts";
import Spinner from "./Spinner";
import placeholder from "../images/placeholder.jpg";
import { deletePost, fetchSinglePost } from "./../slices/posts";
import Comment from "./Comment";
import { selectIsLoggedIn, selectUser } from "./../slices/auth";
import "./styles.css";

dayjs.extend(relativeTime);

const SinglePost = ({ match }) => {
  const dispatch = useDispatch();
  const id = match.params.id;
  const [showComment, setShowComment] = useState(true);
  useEffect(() => {
    dispatch(fetchSinglePost(id));
  }, []);
  const { isLoading, singlePost: post, isLoadingSubmit } = useSelector(
    selectPosts
  );
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (isLoading) return <Spinner />;
  return (
    <div className="container">
      <div className="well" style={{ padding: 5, marginBottom: 0 }}>
        <img
          className="media-object"
          src={post.img || placeholder}
          width="150px"
        />
        <div className="media">
          <h4 className="media-heading">{post.title}</h4>
          <h4>{post?.user?.name || post?.user?.email?.split("@")[0]}</h4>
          {/*<p className="text-right">
                      By {post?.user?.name || post?.user?.email?.split('@')[0]}
                    </p>*/}
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
          <ul className="list-inline list-unstyled">
            <li>
              <span>
                <i className="glyphicon glyphicon-calendar"></i>{" "}
                {dayjs(post.createdAt)?.fromNow()}{" "}
              </span>
            </li>
            <li>|</li>

            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                typeof showComment === "number"
                  ? setShowComment(false)
                  : setShowComment(true)
              }
            >
              <i className="glyphicon glyphicon-comment"></i>{" "}
              {post.comments?.length || 0} comments
            </span>

            {user.id === post?.user?.id && (
              <>
                <li>|</li>
                <span
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete the post?"
                      )
                    )
                      dispatch(deletePost(post.id));
                  }}
                  disabled={isLoadingSubmit}
                  style={{ cursor: "pointer" }}
                >
                  <a>
                    <i className="glyphicon glyphicon-trash"></i>{" "}
                    {isLoadingSubmit ? "Loading..." : "Delete"}
                  </a>
                </span>
              </>
            )}
            {user.id === post?.user?.id && (
              <>
                <li>|</li>
                <span style={{ cursor: "pointer" }}>
                  <Link to={"/edit-post/" + post.id}>
                    <i className="glyphicon glyphicon-pencil"></i> Edit
                  </Link>
                </span>
              </>
            )}
          </ul>

          {showComment ? (
            <div>
              <h3>Comments</h3>
              {post.comments?.map((comment) => {
                return (
                  <div className="card">
                    <b className="text-left c-name">
                      {" "}
                      {comment?.user?.name ||
                        comment?.user?.email?.split("@")[0]}
                    </b>
                    <p
                      className="comment-s"
                      dangerouslySetInnerHTML={{
                        __html: comment.content,
                      }}
                    ></p>
                    <ul className="list-inline list-unstyled">
                      <li>
                        <span>
                          <i className="glyphicon glyphicon-calendar"></i>{" "}
                          {dayjs(comment.createdAt)?.fromNow()}{" "}
                        </span>
                      </li>

                      {user.id === comment?.user?.id && (
                        <>
                          <li>|</li>
                          <span
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure ou want to delete the comment?"
                                )
                              )
                                dispatch(deleteComment(post.id, comment._id));
                            }}
                            disabled={isLoadingSubmit}
                            style={{ cursor: "pointer" }}
                          >
                            <a>
                              <i className="glyphicon glyphicon-trash"></i>{" "}
                              {isLoadingSubmit ? "Loading..." : "Delete"}
                            </a>
                          </span>
                        </>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          {showComment && isLoggedIn && (
            <Comment
              post={post}
              handleCancel={() => setShowComment(null)}
              style={{ backgroundColor: "#73ccd2" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(SinglePost);
