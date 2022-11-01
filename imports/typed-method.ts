import { Meteor } from "meteor/meteor";

type AnyMethod = (...args: any[]) => any;
type NeverReturnPromise<TRun extends AnyMethod> = TRun extends (...args: any[]) => Promise<infer T>
  ? T
  : ReturnType<TRun>;
type AlwaysReturnPromise<TRun extends AnyMethod> = Promise<NeverReturnPromise<TRun>>;
type TypedMethodProps<TRun extends AnyMethod> = {
  name: string;
  guard?: (context: Meteor.MethodThisType) => any;
  run: TRun;
  isServerSide?: boolean;
} & ThisType<Meteor.MethodThisType>;
const defaultGuard = (context: Meteor.MethodThisType) => {
  if (!context.userId && (context.connection || context.isSimulation))
    throw new Meteor.Error("not-authorized", "You must be logged in");
};
export class TypedMethod<TRun extends AnyMethod> {
  private readonly name: string;
  constructor({ name, run, guard = defaultGuard, isServerSide }: TypedMethodProps<TRun>) {
    this.name = name;
    if (isServerSide && !Meteor.isServer) return;
    Meteor.methods({
      async [name](...args) {
        await guard(this);
        Meteor.isDevelopment && console.log("Calling", name, args);
        return run.bind(this)(...args);
      },
    });
  }
  call = async (...args: Parameters<TRun>): AlwaysReturnPromise<TRun> =>
    await Meteor.callAsync(this.name, ...args);
}
