# New Canvas Design Document

**New Canvas** is a node-express app to provide HILR with a simpler alternative to **Canvas**. It

- stores its data in a mongodb DB at mlab.com
- allows SGLs to provide content via markdown or Word
- generates a static site for each course;
- serves the course site to SGMs

## Projects

### MongoDB database at mlab.com

- [ ] specify the schema for each object: user, course,
