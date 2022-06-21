import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";

const insertLink = (title: string, url: string) => LinksCollection.insert({ title, url, createdAt: new Date() });

Meteor.startup(() => {
  LinksCollection.remove({});
  insertLink("Do the Tutorial", "https://www.meteor.com/tutorials/react/creating-an-app");
  insertLink("Follow the Guide", "http://guide.meteor.com");
  insertLink("Read the Docs", "https://docs.meteor.com");
  insertLink("Discussions", "https://forums.meteor.com");
});

Meteor.methods({
  "links.insert": (title: string, url: string) => insertLink(title, url),
  "links.delete": (_id: string) => LinksCollection.remove({ _id }),
});

Meteor.publish("links", () => LinksCollection.find({}));
const invalidDate = new Date("");
Meteor.publish("links.bugged", () => LinksCollection.find({ $or: [{ createdAt: { $gte: invalidDate } }] }));
