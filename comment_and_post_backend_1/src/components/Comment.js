import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {addComment} from '../slices/posts';

const Comment = ({post, handleCancel}) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    if (comment) {
      setLoading(true);
    }
  };
  useEffect(() => {
    (async () => {
      if (loading) {
        await dispatch(addComment(comment, post.id));
        setLoading(false);
        setComment('');
      }
    })();
  }, [loading, addComment]);
  return (
    <div className="col-offset-2 col-md-8 mt-4">
      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          value={comment}
          label="Comment"
          placeholder="Enter Comment"
          onChange={e => setComment(e.target.value)}
        />
        <div style={{margin: 10}}>
          <button
            className="btn btn-primary post"
            disabled={loading}
            onClick={handleSubmit}
          >
            Post
          </button>
          <button
            className="btn btn-danger"
            style={{marginLeft: 7 ,  backgroundColor: "#73ccd2"}}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comment;
