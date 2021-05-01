import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

import { deleteComment, fetchPosts, selectPosts } from "../slices/posts";
import Spinner from "./Spinner";
import placeholder from "../images/placeholder.jpg";
import { deletePost } from "./../slices/posts";
import Comment from "./Comment";
import { selectIsLoggedIn, selectUser } from "./../slices/auth";
import "./style2.css";

dayjs.extend(relativeTime);

const Posts = () => {
  const dispatch = useDispatch();
  const [showComment, setShowComment] = React.useState(null);
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);
  const { isLoading, data: postsData, isLoadingSubmit } = useSelector(
    selectPosts
  );
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (isLoading) return <Spinner />;
  return (
    <>
      {postsData.length
        ? postsData.map((post, index) => (
            <div className="well" key={post.id} style={{ padding: 5 }}>
              <img
                className="media-object"
                src={post.img || placeholder}
                width="150px"
              />
              <div className="media">
                {post?.link ? (
                  <a href={post?.link}>
                    <h4 className="media-heading">{post.title}</h4>
                  </a>
                ) : (
                  <Link to={`/post/${post.id}`}>
                    <h4 className="media-heading">{post.title}</h4>
                  </Link>
                )}

                <h4 className="media-user">
                  {post?.user?.name || post?.user?.email?.split("@")[0]}
                </h4>
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
                        ? setShowComment(null)
                        : setShowComment(index)
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
                              "Are you want you want to delete the post?"
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

                {showComment === index ? (
                  <div style={{ margin: 10, marginTop: 17 }}>
                    <h4>Comments</h4>
                    {post.comments?.map((comment) => {
                      return (
                        <div>
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
                                        "Are you sure you want to delete the comment?"
                                      )
                                    )
                                      dispatch(
                                        deleteComment(post.id, comment._id)
                                      );
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
                {showComment === index && isLoggedIn && (
                  <Comment
                    post={post}
                    handleCancel={() => setShowComment(null)}
                  />
                )}
              </div>
            </div>
          ))
        : "No Post Available"}
    </>
  );
};

export default Posts;
