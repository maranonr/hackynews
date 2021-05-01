import React, { useState, useEffect } from "react";

import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import ImageUploader from "react-images-upload";

import Navbar from "./Navbar";
import { getSinglePost, submitPost, updatePost } from "../slices/posts";
import "./styles.css";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const CreatePost = ({ history, match }) => {
  const id = match?.params.id;
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState([]);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description) {
      const data = { title, description, link, img: image || "" };
      if (!id) await dispatch(submitPost(data));
      if (id) await dispatch(updatePost(id, data));
      history.push("/");
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        const post = await getSinglePost(id);

        setImage(post.img || "");
        setTitle(post.title || "");
        setLink(post.link || "");
        setDescription(post.description || "");
        if (post.img) setFile(dataURLtoFile(post.img, "image"));
      })();
    }
  }, []);

  useEffect(() => {
    if (file.length) {
      const singleFile = file[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setImage(reader.result);
      };
      reader.readAsDataURL(singleFile);
    }
  }, [file]);
  const isLoadingSubmit = useSelector((state) => state.posts.isLoadingSubmit);
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <h1>{id ? "Update" : "Create"} Post</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="title" for="slug">
                  Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="slug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="title" for="url">
                  Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="title " for="description">
                  Description *
                </label>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  required
                />
              </div>

              <div className="form-group">
                <label className="title"></label>
                <ImageUploader
                  withIcon={true}
                  buttonText="Choose image"
                  onChange={setFile}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                  singleImage
                  withPreview
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn-1"
                  className="btn btn-primary post"
                  onClick={handleSubmit}
                  disabled={isLoadingSubmit}
                >
                  {isLoadingSubmit ? "Loading..." : id ? "Update" : "Create"}
                </button>
                <button
                  className="btn btn-default cancel-btn"
                  onClick={() => history.push("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withRouter(CreatePost);
