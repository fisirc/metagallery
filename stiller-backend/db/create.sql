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
    deleted integer not null
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

create table gallery (
    id integer unique primary key autoincrement not null,
    owner integer not null references user (id),
    title text not null,
    description text,
    deploy_stage integer not null,
    url text unique not null
);

create table template (
    id integer unique primary key autoincrement not null,
    tier integer not null references tier (id),
    title text not null,
    description text
);

create table templateblock (
    id integer unique primary key autoincrement not null,
    template integer references template (id),
    gallery integer references gallery (id),
    res integer references file (id),
    title text not null,
    description text not null,
    type text not null,
    posx real not null,
    posy real not null,
    scale real not null,
    direction integer not null
);

insert INTO filetype VALUES
	(0, 'image'),
    (1, 'video'),
    (2, 'object3d');

insert into tier values
	(0, 'free'),
    (1, 'van gogh'),
    (2, 'picasso');

insert into user VALUES (0, 0, 'admin', 'admin', '', '');

