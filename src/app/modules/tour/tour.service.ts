/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { excludeField } from "../../constant";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }
  const tour = await Tour.create(payload);
  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  // filter
  const filter = query;
  // filter = { location: 'Khulna', searchTerm: 'Explore' }
  // delete searchTerm from filter. Now filter = { location: 'Khulna' }
  // search
  const searchTerm = query.searchTerm || "";
  // sort
  const sort = query.sort || "-createdAt";
  // select
  const fields = query.fields?.split(",").join(" ") || "";
  // pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  for (const field of excludeField) {
    // delete filter["searchTerm"];
    // delete filter["sort"];
    delete filter[field];
  }

  const searchQuery = {
    $or: tourSearchableFields.map((field) => ({
      // { title: { $regex: searchTerm, $options: "i" } }
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  const tours = await Tour.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields)
    .skip(skip)
    .limit(limit);
  const totalTours = await Tour.countDocuments();
  return {
    data: tours,
    meta: {
      total: totalTours,
    },
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  const toursType = await TourType.create(payload);

  return toursType;
};
const getAllTourTypes = async () => {
  return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
