/**
 * Diccionario de strings de la app en castellano y euskera.
 * Las claves son namespaced por área (`nav.`, `home.`, `newSighting.`, etc).
 *
 * Cuando una clave falte en `eu`, useT() cae a `es` automáticamente.
 *
 * TODO(post-fase-4): revisar las traducciones de euskera con un nativo.
 * Mientras tanto, son razonables pero pueden tener errores menores.
 */

export type Locale = 'es' | 'eu';

export const SUPPORTED_LOCALES: Locale[] = ['es', 'eu'];

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Castellano',
  eu: 'Euskera',
};

type Messages = Record<string, string>;

const es: Messages = {
  // Navegación
  'nav.home': 'Inicio',
  'nav.map': 'Mapa',
  'nav.new': 'Nuevo',
  'nav.collection': 'Colección',
  'nav.diary': 'Diario',
  'nav.profile': 'Perfil',
  'common.back': 'Atrás',
  'common.loading': 'Cargando...',

  // Home
  'home.greeting': '¡Hola, Leo!',
  'home.subgreeting': '¿Qué animales has visto hoy?',
  'home.nearbyTitle': 'Animales cerca de ti',
  'home.nearbyLoading': 'Buscando qué hay por aquí...',
  'home.nearbyDenied': 'Activa la ubicación para ver qué animales hay cerca.',
  'home.nearbyError': 'No pude consultar ahora. Inténtalo más tarde.',
  'home.nearbyEmpty': 'No hay observaciones recientes registradas en esta zona.',
  'home.newPlace.title': '¡Sitio nuevo!',
  'home.newPlace.subtitle': '¿Qué animales crees que verás aquí?',
  'home.streak.one': '1 día seguido haciendo safari',
  'home.streak.other': '{count} días seguidos haciendo safari',
  'home.weekSummary': 'Esta semana: {sightings} avistamientos',
  'home.weekNewAnimals.one': '1 nuevo',
  'home.weekNewAnimals.other': '{count} nuevos',

  // Mapa
  'map.title': 'Mapa',
  'map.empty': 'Cuando hagas tu primer avistamiento con ubicación aparecerá aquí.',
  'map.count.one': '1 avistamiento con ubicación.',
  'map.count.other': '{count} avistamientos con ubicación.',
  'map.youAreHere': 'Estás aquí',

  // Nuevo avistamiento
  'newSighting.takePhotoTitle': 'Hacer foto',
  'newSighting.takePhotoSubtitle': 'Al animal que quieres añadir al safari.',
  'newSighting.takePhoto': 'Hacer foto',
  'newSighting.galleryHint': 'o elegir de la galería',
  'newSighting.another': 'Otra',
  'newSighting.next': 'Sigue',
  'newSighting.identifyTitle': '¿Qué es?',
  'newSighting.identifySubtitle': 'Escribe el nombre y elige el correcto.',
  'newSighting.searchLabel': '¿Qué animal viste?',
  'newSighting.searchPlaceholder': 'Escribe el nombre...',
  'newSighting.searching': 'Buscando...',
  'newSighting.searchError': 'No se pudo buscar. ¿Hay internet?',
  'newSighting.noResults': 'No encuentro ningún animal con ese nombre. Prueba con otra palabra.',
  'newSighting.caching': 'Buscando información del animal...',
  'newSighting.confirmTitle': '¡Casi! ¿Algo más?',
  'newSighting.confirmSubtitle': 'Revisa los datos y guarda tu avistamiento.',
  'newSighting.animal': 'Animal',
  'newSighting.location': 'Lugar',
  'newSighting.noLocation': 'Sin ubicación',
  'newSighting.note': 'Tu nota (opcional)',
  'newSighting.notePlaceholder': 'Lo que quieras contar de este animal...',
  'newSighting.save': 'Guardar',
  'newSighting.saving': 'Guardando tu avistamiento...',
  'newSighting.saved': '¡Guardado!',

  // Colección (Pokédex)
  'collection.title': 'Tu colección',
  'collection.empty': 'Todavía no has descubierto ningún animal. ¡Hazle una foto al primero!',
  'collection.count.one': '1 animal descubierto',
  'collection.count.other': '{count} animales descubiertos',
  'collection.unclassified': 'Otros',

  // Diario
  'diary.title': 'Diario',
  'diary.empty': 'Aquí verás todas tus aventuras en orden. ¡Empieza haciendo un avistamiento o escribiendo una nota!',
  'diary.count.one': 'Tu 1 aventura',
  'diary.count.other': 'Tus {count} aventuras',
  'diary.writeNote': 'Escribir',
  'diary.notePlaceholder': 'Lo que quieras contar...',
  'diary.noteSave': 'Guardar nota',
  'diary.noteCancel': 'Cancelar',
  'diary.noteLabel': 'Nota libre',

  // Detalle de animal
  'animal.notFound': 'No encontré este animal.',
  'animal.sound': '¿Cómo suena?',
  'animal.soundPlaying': 'Sonando...',
  'animal.wikipedia': 'Saber más en Wikipedia',
  'animal.timesSeen.one': 'Lo has visto 1 vez',
  'animal.timesSeen.other': 'Lo has visto {count} veces',
  'animal.changePhoto': 'Cambiar foto',
  'animal.uploading': 'Subiendo...',
  'animal.delete': 'Borrar',
  'animal.deleteConfirm': '¿Borrar este avistamiento? No se puede deshacer.',
  'animal.edit': 'Editar',
  'animal.characteristics': 'Características',

  // Características
  'char.type': 'Tipo',
  'char.skeleton': 'Esqueleto',
  'char.reproduction': 'Cómo nace',
  'char.habitat': 'Vive en',
  'char.diet': 'Qué come',

  // Editar avistamiento
  'sightingEdit.title': 'Editar avistamiento',
  'sightingEdit.changePhoto': 'Cambiar foto',

  // Cerca de mí — preview
  'nearby.makeSighting': 'Hacer avistamiento de este animal',

  // Perfil
  'profile.title': 'Perfil',
  'profile.statsAvistamientos': 'Avistamientos',
  'profile.statsAnimales': 'Animales',
  'profile.statsLugares': 'Lugares',
  'profile.taxonomyTitle': 'Tus tipos de animales',
  'profile.taxonomyEmpty': 'Cuando hagas avistamientos, aquí verás un gráfico con los tipos de animales que has visto (mamíferos, aves, reptiles...).',
  'profile.languageTitle': 'Idioma',
  'profile.achievementsTitle': 'Logros',
  'profile.kidsTitle': 'Mis peques',
  'profile.activeKid': 'Activo',
  'profile.addKid': 'Añadir peque',
  'profile.editKid': 'Editar peque',
  'profile.deleteKid': 'Eliminar peque',
  'profile.deleteKidConfirm': '¿Eliminar a {name}? Sus avistamientos quedarán ocultos.',
  'profile.kidTitle': 'Datos del peque',
  'profile.kidName': 'Nombre',
  'profile.kidBirthDate': 'Fecha de nacimiento',
  'profile.kidColor': 'Color del avatar',
  'profile.kidAvatar': 'Avatar',
  'profile.edit': 'Editar',
  'profile.save': 'Guardar',
  'profile.signOut': 'Cerrar sesión',
  'profile.viewIntro': 'Ver introducción de la app',
  'animal.yourPhoto': 'Tu foto',

  // Descubrimiento
  'discovery.title': '¡Nuevo descubrimiento!',

  // Logros
  'ach.firstAnimal.title': '¡Primer animal!',
  'ach.firstAnimal.desc': 'Tu primer avistamiento.',
  'ach.threeAnimals.title': 'Tres avistamientos',
  'ach.threeAnimals.desc': 'Has visto 3 animales.',
  'ach.tenAnimals.title': '¡Decena!',
  'ach.tenAnimals.desc': '10 animales avistados.',
  'ach.twentyfive.title': 'Veinticinco',
  'ach.twentyfive.desc': '25 animales avistados.',
  'ach.threeUnique.title': 'Variedad',
  'ach.threeUnique.desc': '3 animales distintos.',
  'ach.tenUnique.title': 'Coleccionista',
  'ach.tenUnique.desc': '10 animales distintos.',
  'ach.threePlaces.title': 'Aventurero',
  'ach.threePlaces.desc': 'Animales en 3 lugares.',
  'ach.fiveClasses.title': 'Naturalista',
  'ach.fiveClasses.desc': '5 tipos distintos.',
  'ach.sevenDays.title': 'Semana de safari',
  'ach.sevenDays.desc': '7 días distintos.',

  // Secciones de logros
  'ach.section.general': 'General',
  'ach.section.collection': 'Colección',
  'ach.section.explorer': 'Explorador',
  'ach.section.classes': 'Por clase',

  // Subsecciones por clase
  'ach.class.mammals': 'Mamíferos',
  'ach.class.birds': 'Aves',
  'ach.class.reptiles': 'Reptiles',
  'ach.class.amphibians': 'Anfibios',
  'ach.class.fish': 'Peces',
  'ach.class.insects': 'Insectos',
  'ach.class.arachnids': 'Arácnidos',
  'ach.class.molluscs': 'Moluscos',

  // Logros por clase — mamíferos
  'ach.first.mammals.title': 'Primer mamífero',
  'ach.first.mammals.desc': 'Has visto un mamífero.',
  'ach.expert.mammals.title': 'Experto en mamíferos',
  'ach.expert.mammals.desc': '5 mamíferos diferentes.',

  // Aves
  'ach.first.birds.title': 'Primera ave',
  'ach.first.birds.desc': 'Has visto un ave.',
  'ach.expert.birds.title': 'Experto en aves',
  'ach.expert.birds.desc': '5 aves diferentes.',

  // Reptiles
  'ach.first.reptiles.title': 'Primer reptil',
  'ach.first.reptiles.desc': 'Has visto un reptil.',
  'ach.expert.reptiles.title': 'Experto en reptiles',
  'ach.expert.reptiles.desc': '3 reptiles diferentes.',

  // Anfibios
  'ach.first.amphibians.title': 'Primer anfibio',
  'ach.first.amphibians.desc': 'Has visto un anfibio.',
  'ach.expert.amphibians.title': 'Experto en anfibios',
  'ach.expert.amphibians.desc': '3 anfibios diferentes.',

  // Peces
  'ach.first.fish.title': 'Primer pez',
  'ach.first.fish.desc': 'Has visto un pez.',
  'ach.expert.fish.title': 'Experto en peces',
  'ach.expert.fish.desc': '5 peces diferentes.',

  // Insectos
  'ach.first.insects.title': 'Primer insecto',
  'ach.first.insects.desc': 'Has visto un insecto.',
  'ach.expert.insects.title': 'Experto en insectos',
  'ach.expert.insects.desc': '5 insectos diferentes.',

  // Arácnidos
  'ach.first.arachnids.title': 'Primer arácnido',
  'ach.first.arachnids.desc': 'Has visto un arácnido.',
  'ach.expert.arachnids.title': 'Experto en arácnidos',
  'ach.expert.arachnids.desc': '3 arácnidos diferentes.',

  // Moluscos
  'ach.first.molluscs.title': 'Primer molusco',
  'ach.first.molluscs.desc': 'Has visto un molusco.',
  'ach.expert.molluscs.title': 'Experto en moluscos',
  'ach.expert.molluscs.desc': '3 moluscos diferentes.',

  // Quién eres
  'whoAreYou.title': '¿Quién eres?',
  'whoAreYou.subtitle': 'Pulsa para entrar.',
  'whoAreYou.leo': 'Soy Leo',
  'whoAreYou.papa': 'Soy papá',
  'needsPapa.title': 'Pídele a papá',
  'needsPapa.body': 'Papá tiene que entrar primero la primera vez. Pásale la app y dile que pulse "Soy papá".',
  'needsPapa.cta': 'Soy papá',
  'profile.changeUser': 'Cambiar de usuario',
  'supervision.banner': 'Recuerda: usa esto con papá',

  // Atributos del avistamiento (modo compañero)
  'attr.sizeLabel': '¿Tamaño?',
  'attr.colorLabel': '¿De qué color?',
  'attr.activityLabel': '¿Qué hacía?',
  'attr.size.small': 'Pequeño',
  'attr.size.medium': 'Mediano',
  'attr.size.large': 'Grande',
  'attr.color.white': 'Blanco',
  'attr.color.black': 'Negro',
  'attr.color.brown': 'Marrón',
  'attr.color.gray': 'Gris',
  'attr.color.yellow': 'Amarillo',
  'attr.color.orange': 'Naranja',
  'attr.color.red': 'Rojo',
  'attr.color.green': 'Verde',
  'attr.activity.sleeping': 'Durmiendo',
  'attr.activity.eating': 'Comiendo',
  'attr.activity.drinking': 'Bebiendo',
  'attr.activity.flying': 'Volando',
  'attr.activity.swimming': 'Nadando',
  'attr.activity.hiding': 'Escondido',
  'attr.activity.playing': 'Jugando',
  'attr.activity.walking': 'Andando',

  // Reto semanal
  'challenge.weekly': 'Reto de la semana',
  'challenge.prompt': '¿Puedes encontrar un {className}?',
  'challenge.completed': '¡Reto conseguido! Encontraste {className}',
};

const eu: Messages = {
  // Nabigazioa
  'nav.home': 'Hasiera',
  'nav.map': 'Mapa',
  'nav.new': 'Berria',
  'nav.collection': 'Bilduma',
  'nav.diary': 'Egunerokoa',
  'nav.profile': 'Profila',
  'common.back': 'Atzera',
  'common.loading': 'Kargatzen...',

  // Hasiera
  'home.greeting': 'Kaixo, Leo!',
  'home.subgreeting': 'Zer animalia ikusi dituzu gaur?',
  'home.nearbyTitle': 'Inguruko animaliak',
  'home.nearbyLoading': 'Hemen zer dagoen bilatzen...',
  'home.nearbyDenied': 'Kokapena gaitu inguruan zer animalia dauden ikusteko.',
  'home.nearbyError': 'Ezin izan dut kontsultatu. Saiatu beranduago.',
  'home.nearbyEmpty': 'Ez dago inguru honetan azken behaketarik.',
  'home.newPlace.title': 'Leku berria!',
  'home.newPlace.subtitle': 'Zer animalia ikusiko dituzula uste duzu hemen?',
  'home.streak.one': 'Egun 1 jarraian safarian',
  'home.streak.other': '{count} egun jarraian safarian',
  'home.weekSummary': 'Aste honetan: {sightings} behaketa',
  'home.weekNewAnimals.one': '1 berria',
  'home.weekNewAnimals.other': '{count} berri',

  // Mapa
  'map.title': 'Mapa',
  'map.empty': 'Kokapenarekin lehen behaketa egiten duzunean, hemen agertuko da.',
  'map.count.one': 'Behaketa 1 kokapenarekin.',
  'map.count.other': '{count} behaketa kokapenarekin.',
  'map.youAreHere': 'Hemen zaude',

  // Behaketa berria
  'newSighting.takePhotoTitle': 'Argazkia atera',
  'newSighting.takePhotoSubtitle': 'Safarira gehitu nahi duzun animaliari.',
  'newSighting.takePhoto': 'Argazkia atera',
  'newSighting.galleryHint': 'edo galeriatik aukeratu',
  'newSighting.another': 'Beste bat',
  'newSighting.next': 'Jarraitu',
  'newSighting.identifyTitle': 'Zer da?',
  'newSighting.identifySubtitle': 'Idatzi izena eta aukeratu egokia.',
  'newSighting.searchLabel': 'Zer animalia ikusi duzu?',
  'newSighting.searchPlaceholder': 'Idatzi izena...',
  'newSighting.searching': 'Bilatzen...',
  'newSighting.searchError': 'Ezin izan da bilatu. Internet dago?',
  'newSighting.noResults': 'Ez dut izen horretako animaliarik aurkitu. Saiatu beste hitz batekin.',
  'newSighting.caching': 'Animaliaren informazioa bilatzen...',
  'newSighting.confirmTitle': 'Ia! Beste zerbait?',
  'newSighting.confirmSubtitle': 'Egiaztatu datuak eta gorde behaketa.',
  'newSighting.animal': 'Animalia',
  'newSighting.location': 'Lekua',
  'newSighting.noLocation': 'Kokapenik gabe',
  'newSighting.note': 'Zure oharra (aukerakoa)',
  'newSighting.notePlaceholder': 'Animalia honi buruz kontatu nahi duzuna...',
  'newSighting.save': 'Gorde',
  'newSighting.saving': 'Behaketa gordetzen...',
  'newSighting.saved': 'Gordeta!',

  // Bilduma
  'collection.title': 'Zure bilduma',
  'collection.empty': 'Oraindik ez duzu animaliarik aurkitu. Atera argazkia lehenengoari!',
  'collection.count.one': 'Animalia 1 aurkituta',
  'collection.count.other': '{count} animalia aurkituta',
  'collection.unclassified': 'Besteak',

  // Egunerokoa
  'diary.title': 'Egunerokoa',
  'diary.empty': 'Hemen abentura guztiak ordenan ikusiko dituzu. Hasi behaketa bat egin edo ohar bat idatziz!',
  'diary.count.one': 'Zure abentura 1',
  'diary.count.other': 'Zure {count} abenturak',
  'diary.writeNote': 'Idatzi',
  'diary.notePlaceholder': 'Kontatu nahi duzuna...',
  'diary.noteSave': 'Gorde oharra',
  'diary.noteCancel': 'Utzi',
  'diary.noteLabel': 'Ohar librea',

  // Animalia xehetasuna
  'animal.notFound': 'Ez dut aurkitu animalia hau.',
  'animal.sound': 'Nola entzuten da?',
  'animal.soundPlaying': 'Entzuten...',
  'animal.wikipedia': 'Gehiago jakin Wikipedian',
  'animal.timesSeen.one': 'Behin ikusi duzu',
  'animal.timesSeen.other': '{count} aldiz ikusi duzu',
  'animal.changePhoto': 'Argazkia aldatu',
  'animal.uploading': 'Igotzen...',
  'animal.delete': 'Ezabatu',
  'animal.deleteConfirm': 'Behaketa hau ezabatu? Ezin da desegin.',
  'animal.edit': 'Editatu',
  'animal.characteristics': 'Ezaugarriak',

  // Ezaugarriak
  'char.type': 'Mota',
  'char.skeleton': 'Hezurdura',
  'char.reproduction': 'Nola jaiotzen da',
  'char.habitat': 'Non bizi da',
  'char.diet': 'Zer jaten du',

  // Behaketa editatu
  'sightingEdit.title': 'Behaketa editatu',
  'sightingEdit.changePhoto': 'Argazkia aldatu',

  // Hurbilekoak — aurrebista
  'nearby.makeSighting': 'Animalia honen behaketa egin',

  // Profila
  'profile.title': 'Profila',
  'profile.statsAvistamientos': 'Behaketak',
  'profile.statsAnimales': 'Animaliak',
  'profile.statsLugares': 'Lekuak',
  'profile.taxonomyTitle': 'Zure animalia motak',
  'profile.taxonomyEmpty': 'Behaketak egiten dituzunean, hemen ikusiko duzu zer animalia mota ikusi dituzun (ugaztunak, hegaztiak, narrastiak...).',
  'profile.languageTitle': 'Hizkuntza',
  'profile.achievementsTitle': 'Lorpenak',
  'profile.kidsTitle': 'Nire umeak',
  'profile.activeKid': 'Aktibo',
  'profile.addKid': 'Umea gehitu',
  'profile.editKid': 'Umea editatu',
  'profile.deleteKid': 'Umea ezabatu',
  'profile.deleteKidConfirm': '{name} ezabatu? Bere behaketak ezkutatuko dira.',
  'profile.kidTitle': 'Umearen datuak',
  'profile.kidName': 'Izena',
  'profile.kidBirthDate': 'Jaiotze-data',
  'profile.kidColor': 'Avatar kolorea',
  'profile.kidAvatar': 'Avatarra',
  'profile.edit': 'Editatu',
  'profile.save': 'Gorde',
  'profile.signOut': 'Saioa itxi',
  'profile.viewIntro': 'Aplikazioaren sarrera ikusi',
  'animal.yourPhoto': 'Zure argazkia',

  // Aurkikuntza
  'discovery.title': 'Aurkikuntza berria!',

  // Lorpenak
  'ach.firstAnimal.title': 'Lehen animalia!',
  'ach.firstAnimal.desc': 'Zure lehen behaketa.',
  'ach.threeAnimals.title': 'Hiru behaketa',
  'ach.threeAnimals.desc': '3 animalia ikusi dituzu.',
  'ach.tenAnimals.title': 'Hamar!',
  'ach.tenAnimals.desc': '10 animalia ikusi dituzu.',
  'ach.twentyfive.title': 'Hogeita bost',
  'ach.twentyfive.desc': '25 animalia ikusi dituzu.',
  'ach.threeUnique.title': 'Aniztasuna',
  'ach.threeUnique.desc': '3 animalia desberdin.',
  'ach.tenUnique.title': 'Bildumaria',
  'ach.tenUnique.desc': '10 animalia desberdin.',
  'ach.threePlaces.title': 'Abenturazalea',
  'ach.threePlaces.desc': 'Animaliak 3 lekutan.',
  'ach.fiveClasses.title': 'Naturalista',
  'ach.fiveClasses.desc': '5 mota desberdin.',
  'ach.sevenDays.title': 'Safari astea',
  'ach.sevenDays.desc': '7 egun desberdinetan.',

  // Lorpenen sekzioak
  'ach.section.general': 'Orokorra',
  'ach.section.collection': 'Bilduma',
  'ach.section.explorer': 'Esploratzailea',
  'ach.section.classes': 'Mota',

  // Azpisekzioak motaz
  'ach.class.mammals': 'Ugaztunak',
  'ach.class.birds': 'Hegaztiak',
  'ach.class.reptiles': 'Narrastiak',
  'ach.class.amphibians': 'Anfibioak',
  'ach.class.fish': 'Arrainak',
  'ach.class.insects': 'Intsektuak',
  'ach.class.arachnids': 'Armiarmak',
  'ach.class.molluscs': 'Moluskuak',

  // Ugaztunak
  'ach.first.mammals.title': 'Lehen ugaztuna',
  'ach.first.mammals.desc': 'Ugaztun bat ikusi duzu.',
  'ach.expert.mammals.title': 'Ugaztunen aditua',
  'ach.expert.mammals.desc': '5 ugaztun desberdin.',

  // Hegaztiak
  'ach.first.birds.title': 'Lehen hegaztia',
  'ach.first.birds.desc': 'Hegazti bat ikusi duzu.',
  'ach.expert.birds.title': 'Hegaztien aditua',
  'ach.expert.birds.desc': '5 hegazti desberdin.',

  // Narrastiak
  'ach.first.reptiles.title': 'Lehen narrastia',
  'ach.first.reptiles.desc': 'Narrasti bat ikusi duzu.',
  'ach.expert.reptiles.title': 'Narrastien aditua',
  'ach.expert.reptiles.desc': '3 narrasti desberdin.',

  // Anfibioak
  'ach.first.amphibians.title': 'Lehen anfibioa',
  'ach.first.amphibians.desc': 'Anfibio bat ikusi duzu.',
  'ach.expert.amphibians.title': 'Anfibioen aditua',
  'ach.expert.amphibians.desc': '3 anfibio desberdin.',

  // Arrainak
  'ach.first.fish.title': 'Lehen arraina',
  'ach.first.fish.desc': 'Arrain bat ikusi duzu.',
  'ach.expert.fish.title': 'Arrainen aditua',
  'ach.expert.fish.desc': '5 arrain desberdin.',

  // Intsektuak
  'ach.first.insects.title': 'Lehen intsektua',
  'ach.first.insects.desc': 'Intsektu bat ikusi duzu.',
  'ach.expert.insects.title': 'Intsektuen aditua',
  'ach.expert.insects.desc': '5 intsektu desberdin.',

  // Armiarmak
  'ach.first.arachnids.title': 'Lehen armiarma',
  'ach.first.arachnids.desc': 'Armiarma bat ikusi duzu.',
  'ach.expert.arachnids.title': 'Armiarmen aditua',
  'ach.expert.arachnids.desc': '3 armiarma desberdin.',

  // Moluskuak
  'ach.first.molluscs.title': 'Lehen moluskua',
  'ach.first.molluscs.desc': 'Molusku bat ikusi duzu.',
  'ach.expert.molluscs.title': 'Moluskuen aditua',
  'ach.expert.molluscs.desc': '3 molusku desberdin.',

  // Nor zara
  'whoAreYou.title': 'Nor zara?',
  'whoAreYou.subtitle': 'Sakatu sartzeko.',
  'whoAreYou.leo': 'Leo naiz',
  'whoAreYou.papa': 'Aita naiz',
  'needsPapa.title': 'Aitari eskatu',
  'needsPapa.body': 'Aitak sartu behar du lehenik lehen aldian. Eman aplikazioa eta esan "Aita naiz" sakatzeko.',
  'needsPapa.cta': 'Aita naiz',
  'profile.changeUser': 'Erabiltzailez aldatu',
  'supervision.banner': 'Gogoratu: aitarekin erabili hau',

  // Behaketaren ezaugarriak (lagun modua)
  'attr.sizeLabel': 'Tamaina?',
  'attr.colorLabel': 'Zer kolore?',
  'attr.activityLabel': 'Zer egiten zuen?',
  'attr.size.small': 'Txikia',
  'attr.size.medium': 'Ertaina',
  'attr.size.large': 'Handia',
  'attr.color.white': 'Zuria',
  'attr.color.black': 'Beltza',
  'attr.color.brown': 'Marroia',
  'attr.color.gray': 'Grisa',
  'attr.color.yellow': 'Horia',
  'attr.color.orange': 'Laranja',
  'attr.color.red': 'Gorria',
  'attr.color.green': 'Berdea',
  'attr.activity.sleeping': 'Lo egiten',
  'attr.activity.eating': 'Jaten',
  'attr.activity.drinking': 'Edaten',
  'attr.activity.flying': 'Hegan',
  'attr.activity.swimming': 'Igeri',
  'attr.activity.hiding': 'Ezkutatuta',
  'attr.activity.playing': 'Jolasten',
  'attr.activity.walking': 'Ibiltzen',

  // Asteko erronka
  'challenge.weekly': 'Asteko erronka',
  'challenge.prompt': '{className} bat aurki dezakezu?',
  'challenge.completed': 'Erronka lortuta! {className} aurkitu duzu',
};

export const MESSAGES: Record<Locale, Messages> = { es, eu };
