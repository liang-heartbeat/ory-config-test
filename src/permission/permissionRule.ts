import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types"


class Actor implements Namespace { 
  
}

// It is used to group actors. Group has similar meaning of role
class Role implements Namespace {
  related: {
    members: (Actor | Role)[]
  }
}

// Organisation and Department are used for express hierarchy relation. 
// Do we need them?
class Organisation implements Namespace {
  related: {
    parent: (Organisation)[]
    reader: (SubjectSet<Role, "members"> | Actor)[]
    editor: (SubjectSet<Role, "members"> | Actor)[]
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
class Resource implements Namespace {
  related: {
    parent: (Organisation | Resource)[]
    reader: (SubjectSet<Role, "members"> | Actor)[]
    editor: (SubjectSet<Role, "members"> | Actor)[]
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