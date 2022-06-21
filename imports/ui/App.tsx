import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useState } from "react";
import { Link, LinksCollection } from "../api/links";

const makeLink = (link: Link) => {
  return (
    <li key={link._id}>
      <a href={link.url} target="_blank">
        {link.title}
      </a>{" "}
      {link.createdAt.toISOString() + " "}
      <button onClick={() => Meteor.call("links.delete", link._id)}>Delete</button>
    </li>
  );
};

export const App = () => {
  const [state, setState] = useState("ok");

  const links = useTracker(() => {
    Meteor.subscribe("links");
    return LinksCollection.find({}, { sort: { createdAt: 1 } }).fetch();
  });

  const triggerBug = () => {
    setState("bugged");
    Meteor.subscribe("links.bugged");
  };

  return (
    <div>
      <button onClick={() => Meteor.call("links.insert", Math.random().toString(36).slice(2, 7), "http://localhost:3000/")}>Create link via method</button>
      <button onClick={() => LinksCollection.insert({ title: "title", url: "url", createdAt: new Date() })}>Create link via Collection</button>
      <button onClick={triggerBug}>Trigger the bug</button>
      <h2>State: {state}</h2>
      <pre>
        Triggering the bug will throw an error on the server side, only once,
        <br />
        you can refresh the page and trigger it again, the bug will be there but the error thrown won't be shown again.
        <br />
        Once bugged, the client can't mutate the collection anymore but still receive data from other clients.
        <br />
        Client side, this error is silent, the buggy subscription is never ready.
        <br />
        Can still create links via Collection but this is only local.
      </pre>
      <h2>Learn Meteor!</h2>
      <ul>{links.map(makeLink)}</ul>
    </div>
  );
};
