import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  // search name is come or not
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  // get desire document
  const division = this.getUpdate() as IDivision;
  if (division.name) {
    const baseSlug = division.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    division.slug = slug;
  }
  // manually update in database
  this.setUpdate(division);

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
