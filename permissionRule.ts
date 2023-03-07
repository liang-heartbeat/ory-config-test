import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types"

// It is used to define multiple types of actors
class Actor implements Namespace { 
  related: {
    user: Actor[]
    bot: Actor[]
  }
}

// It is used to group actors. Group has similar meaning of role
class Group implements Namespace {
  related: {
    members: (Actor | Group)[]
  }
}

// Organisation and Department are used for express hierarchy relation. 
// Do we need them?
class Organisation implements Namespace {
  related: {
    parent: (Organisation)[]
    reader: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
    editor: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
  }
  permits = {
    read: (ctx: Context): boolean =>
      this.related.reader.includes(ctx.subject) ||
      this.related.editor.includes(ctx.subject) ||
      this.related.parent.traverse((p) => p.permits.read(ctx)),
    edit: (ctx: Context): boolean =>
      this.related.editor.includes(ctx.subject)||
      this.related.parent.traverse((p) => p.permits.edit(ctx))
  }
}

class Department implements Namespace {
  related: {
    parent: (Organisation)[]
    reader: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
    editor: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
  }
  permits = {
    read: (ctx: Context): boolean =>
      this.related.reader.includes(ctx.subject) ||
      this.related.editor.includes(ctx.subject) ||
      this.related.parent.traverse((p) => p.permits.read(ctx)),
    edit: (ctx: Context): boolean =>
      this.related.editor.includes(ctx.subject)||
      this.related.parent.traverse((p) => p.permits.edit(ctx))
  }
}


// Folder and File are resources/object we want to control access of.
class Folder implements Namespace {
  related: {
    parent: (Department|Organisation)[]
    reader: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
    editor: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
  }

  permits = {
    read: (ctx: Context): boolean =>
      this.related.reader.includes(ctx.subject) ||
      this.related.editor.includes(ctx.subject) ||
      this.related.parent.traverse((p) => p.permits.read(ctx)),
    edit: (ctx: Context): boolean =>
      this.related.editor.includes(ctx.subject)||
      this.related.parent.traverse((p) => p.permits.edit(ctx))
  }
}

// How to name it
class File implements Namespace {
  related: {
    parent: (Folder)[]
    reader: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
    editor: (SubjectSet<Actor, "user"> | SubjectSet<Group, "members">)[]
  }

  permits = {
    read: (ctx: Context): boolean =>
      this.related.reader.includes(ctx.subject) ||
      this.related.editor.includes(ctx.subject) ||
      this.related.parent.traverse((p) => p.permits.read(ctx)),
    edit: (ctx: Context): boolean =>
      this.related.editor.includes(ctx.subject)||
      this.related.parent.traverse((p) => p.permits.edit(ctx))
  }
}