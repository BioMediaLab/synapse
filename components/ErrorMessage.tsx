import App from "../components/App";

export default ({ message }) => (
  <App>
    <aside>
      {message}
      <style>{`
        aside {
          padding: 1.5em;
          font-size: 14px;
          color: white;
          background-color: red;
        }
      `}</style>
    </aside>
  </App>
);
