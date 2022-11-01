import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Link, mutateLink, subscribeToLinks } from "../api/links";

const makeLink = (link: Link) => {
  return (
    <li key={link._id}>
      <a
        href={link.url}
        target="_blank"
      >
        {link.title}
        <b>{link.updatedAt?.toLocaleDateString()}</b>
      </a>
      <button onClick={() => mutateLink.call(link._id!)}>mutate</button>
      <button onClick={() => Meteor.callAsync("links.mutate.pure.meteor", link._id)}>
        mutate pure meteor
      </button>
    </li>
  );
};

export const Info = () => {
  const links = useTracker(() => subscribeToLinks.fetchAll());

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <ul>{links.map(makeLink)}</ul>
    </div>
  );
};
