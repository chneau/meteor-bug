import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { TypedMethod } from "../typed-method";
import { TypedSubscribe } from "../typed-subscribe";

export interface Link {
  _id?: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const LinksCollection = new Mongo.Collection<Link>("links");

export const subscribeToLinks = new TypedSubscribe({
  name: "links",
  guardPredicate: () => true,
  run() {
    return LinksCollection.find();
  },
});

export const mutateLinkUpdatedAt = new TypedMethod({
  name: "links.mutateLinkUpdatedAt",
  async run(linkId: string) {
    return await LinksCollection.updateAsync(linkId, { $set: { updatedAt: new Date() } });
  },
});

export const mutateLinkTitle = new TypedMethod({
  name: "links.mutateLinkTitle",
  async run(linkId: string, title: string) {
    return await LinksCollection.updateAsync(linkId, { $set: { title } });
  },
});

export const mutateLink = new TypedMethod({
  name: "links.mutate",
  guard: () => {},
  async run(_id: string) {
    await mutateLinkUpdatedAt.call(_id);
    await mutateLinkTitle.call(_id, `New title ${Math.random()}`);
  },
});

Meteor.methods({
  async "links.mutate.pure.meteor"(_id: string) {
    await Meteor.callAsync("links.mutateLinkUpdatedAt.pure.meteor", _id);
    await Meteor.callAsync("links.mutateLinkTitle.pure.meteor", _id, `New title ${Math.random()}`);
  },
  async "links.mutateLinkUpdatedAt.pure.meteor"(linkId: string) {
    return await LinksCollection.updateAsync(linkId, { $set: { updatedAt: new Date() } });
  },
  async "links.mutateLinkTitle.pure.meteor"(linkId: string, title: string) {
    return await LinksCollection.updateAsync(linkId, { $set: { title } });
  },
});
