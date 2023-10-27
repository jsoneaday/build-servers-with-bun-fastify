begin;

-- profiles
insert into "Profile" ("updatedAt", "userName", "fullName", "description") values (NOW(), 'jon', 'John White', 'Hello I''m a developer') returning id;
insert into "Profile" ("updatedAt", "userName", "fullName", "description") values (NOW(), 'jane', 'Jane Lee', 'Hello I''m a doctor') returning id;
insert into "Profile" ("updatedAt", "userName", "fullName", "description") values (NOW(), 'rich', 'Richard Smith', 'Hello I''m a chef') returning id;

-- follows
insert into "Follow" ("updatedAt", "followerId", "followedId") values (NOW(), 1, 2);
insert into "Follow" ("updatedAt", "followerId", "followedId") values (NOW(), 1, 3);

-- messages
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 2, 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 2, 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 3, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 3, 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
insert into "Message" ("updatedAt", "authorId", "body") values (NOW(), 3, 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

-- -- responses
insert into "MessageResponse" ("updatedAt", "responderMsgId", "respondedMsgId") values (NOW(), 1, 4);

-- -- broadcasts
insert into "MessageBroadcast" ("updatedAt", "broadcasterMsgId", "broadcastMsgId") values (NOW(), 2, 5);

commit;