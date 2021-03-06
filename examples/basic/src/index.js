/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useQuery, queryCache } from "react-query";

function App() {
  const [postId, setPostId] = React.useState(-1);

  return (
    <>
      <p>
        As you visit the posts below, you will notice them in a loading state
        the first time you load them. However, after you return to this list and
        click on any posts you have already visited again, you will see them
        load instantly and background refresh right before your eyes!{" "}
        <strong>
          (You may need to throttle your network speed to simulate longer
          loading sequences)
        </strong>
      </p>
      {postId > -1 ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
    </>
  );
}

// This function is not inline to show how query keys are passed to the query function
// Normally, you can inline them if you want.
const getPostById = async (key, id) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return data;
};

function Posts({ setPostId }) {
  const { status, data, error, isFetching } = useQuery("posts", async () => {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return data;
  });

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map(post => (
                <p key={post.id}>
                  <a
                    onClick={() => setPostId(post.id)}
                    href="#"
                    style={
                      // We can use the queryCache here to show bold links for
                      // ones that are cached
                      queryCache.getQueryData(["post", post.id])
                        ? {
                            fontWeight: "bold",
                            color: "green"
                          }
                        : {}
                    }
                  >
                    {post.title}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}

function Post({ postId, setPostId }) {
  const { status, data, error, isFetching } = useQuery(
    ["post", postId],
    getPostById,
    {
      enabled: postId
    }
  );

  return (
    <div>
      <div>
        <a onClick={() => setPostId(-1)} href="#">
          Back
        </a>
      </div>
      {!postId || status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
