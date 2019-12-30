create table "user"(
    user_id serial8 primary key,
    created_at timestamptz
);

create table user_email(
    email_id serial8 primary key,
    user_id bigint not null references "user" (user_id),
    is_primary boolean,
    email varchar not null,
    verified_at timestamptz
);

create table game_category(
    game_category_id serial8 primary key,
    name varchar not null
)

create table game_type(
    game_type_id serial8 primary key,
);

create table game(
    game_id serial8 primary key,
    game_type_id bigint not null references game_type(game_type_id),
    teams_min int default 2,
    teams_max int default 2,
    team_min_size int default 1,
    team_max_size int default 1,
    match_to_points float,
    win_by_points float default 0,

);

create table player(
    player_id serial8 primary key,
    user_id bigint not null references user(user_id),
    name varchar
);

create table game_phase(
  game_phase_id serial8 primary key,
  parent_game_phase_id bigint references game_phase(game_phase_id)
  sequence int,
  name varchar,
);

create table team(
    team_id serial8 primary key,
    name varchar
);

create table team_player(
    team_player_id serial8 primary key,
    player_id bigint not null references player(player_id),
    team_id bigint not null references team(team_id)
);1

create table game_match(
    game_match_id serial8 primary key,
    game_id bigint references game(game_id),
);


create table game_match_team_result(
    game_id bigint not null references game(game_id),
    team_id bigint not null references team(team_id)
    points float,
);

create table game_participant(
    game_id bigint references game(game_id),
    team_player_id bigint references team_player(team_player_id)
);
