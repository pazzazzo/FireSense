# Événements Socket.io - Client vers Serveur

## Événements émis par le client

### login
- **Arguments :** 
  - `user_id` (String) : L'id de l'utilisateur.
  - `password` (String) : Le mot de passe de l'utilisateur.
  - `cookie_session` (String) : Le cookie de session de l'utilisateur.

### user.create
- **Arguments :** 
  - `user_id` (String) : L'id de l'utilisateur à créer.
  - `username` (String) : Le nom de l'utilisateur à créer
  - `password` (String) : Le mot de passe du nouvel utilisateur.
  - `user_type` (String) : Le type d'utilisateur à créer.

### user.delete
- **Arguments :** 
  - `user_id` (String) : L'id de l'utilisateur à supprimer.
  - `callback` (Function(): boolean) : Callback témoin de succès.

### user.admin.change
- **Arguments :** 
  - `user_id` (String) : L'id de l'utilisateur à changer les droits.
  - `callback` (Function(): boolean) : Callback témoin de succès.

### users.update
- **Arguments :**
  - `null`

### logs.get
- **Arguments :**
  - `null`

### pylons.get
- **Arguments :**
  - `callback` (Function(): Object) : Callback qui renvoie les poteaux.


### pylon.get
- **Arguments :**
  - `pylon_id` (String) : L'identifiant du poteau à récupérer.
  - `callback` (Function(): Object) : Callback qui renvoie le poteau.

### pylon.stream
- **Arguments :**
  - `pylon_id` (String) : L'identifiant du poteau à stream.
  - `callback` (Function(): Object) : Callback qui renvoie le poteau en témoin de succès.

### pylon.unstream
- **Arguments :**
  - `stream_id` (String) : L'identifiant du stream à détruire
  - `callback` (Function(): Object) : Callback qui renvoie le poteau en témoin de succès.

### pylon.pos.update
- **Arguments :** 
  - `pylon_id` (String) : L'identifiant du poteau.
  - `pos` (Object) : La position mise à jour du poteau.
  - `callback` (Function(): boolean) : Callback témoin de succès.

### mq2.sensibility.set
- **Arguments :**
  - `pylon_id` (String) : L'identifiant du poteau.
  - `captor_id` (String) : L'identifiant du capteur.
  - `sensibility` (Number) : Sensibilité du capteur.
  - `callback` (Function(): boolean, error) : Callback témoin de succès.



## Événements émis par le serveur

### users.update
- **Arguments :**
  - `users` (Object) : Objet JSON des utilisateurs.

### log.post
- **Arguments :**
  - `content` (String) : Contenu des logs
  - `index` (Number) : Index du log

### pylon.stream.%stream_id%
- **Arguments :**
  - `pylon` (Object) : Objet JSON du poteau