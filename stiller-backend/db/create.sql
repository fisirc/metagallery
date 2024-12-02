create table filetype (
    code integer unique primary key not null,
    name text unique not null
);

create table file (
    id integer unique primary key autoincrement not null,
    owner integer not null references user (id),
    type integer not null references filetype (code),
    path text unique not null,
    filename text not null,
    title text,
    description text,
    ext text not null,
    hashed integer not null,
    size real not null,
    deleted integer not null default 0
);

create table tier (
    id integer unique primary key not null,
    name text unique not null
);

create table user (
    id integer unique primary key autoincrement not null,
    tier integer not null references tier (id),
    displayname text not null,
    username text unique not null,
    mail text not null,
    bpasswd text not null
);

create table avatar (
    user integer not null references user (id),
    file integer not null references file (id)
);

create table metatemplatefile (
    id integer unique primary key autoincrement not null
);

create table template (
    id integer unique primary key autoincrement not null,
    owner integer not null references user (id),
    tier integer not null references tier (id),
    templatefile integer not null references metatemplatefile(id),
    title text not null,
    description text not null
);

create table galleryslot (
    gallery integer not null references gallery (id),
    slotid text not null,
    res integer references file (id),
    title text,
    description text
);

create table gallery (
    id integer unique primary key autoincrement not null,
    owner integer not null references user (id),
    template integer not null references template (id),
    deleted integer not null default 0,
    slug text unique not null,
    title text,
    description text
);

create table gallery_telem (
    id integer unique primary key autoincrement not null,
    gallery integer not null references gallery (id),
    user integer not null references user (id),
    user_agent text not null,
    load_time real not null,
    used_time real not null default 0
)

insert into
    filetype
values
    (0, 'image'),
    (1, 'video'),
    (2, 'object3d');

insert into
    tier
values
    (0, 'free'),
    (1, 'van gogh'),
    (2, 'picasso');

