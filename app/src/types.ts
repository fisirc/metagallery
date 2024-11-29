// Represents a row in the 'file' table
export interface UserContentFileElement {
  id: number,
  url: string,
  ext: string,
  title: string,
  description?: string,
}

export interface TemplateListItem {
  id: number,
  tier: number,
  templatefile: number,
  title: string,
  description: string,
}

export type SlotVertex = readonly [number, number, number];

export type SlotVertices = readonly [SlotVertex, SlotVertex, SlotVertex, SlotVertex]

export type JSONPrimitive = string | number | boolean | null | undefined;

export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue; };

export type GallerySlot = {
  type: "2d";
  props: Record<string, JSONValue>;
  v: SlotVertex[];
  ref: string;
  res: number;
  title: string;
  description: string;
};

export type GalleryData = {
  origin: [number, number];
  slots: GallerySlot[];
};

export type StillerGallery = {
  id: number;
  title: string;
  description: string;
  ownerid: number;
  templateid: number;
  slug: string;
  slots: GalleryData;
};
