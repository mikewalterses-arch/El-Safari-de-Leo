/**
 * Catálogo curado de animales con metadata multi-tag rica.
 * Usado para sobreescribir las heurísticas de iNat (que fallan en casos como
 * pingüino-no-vuela, murciélago-mamífero-volador, ornitorrinco-mamífero-ovíparo).
 *
 * Lookup por nombre común (es) o científico, con normalización (lowercase,
 * sin tildes). Si el animal está en el catálogo, sus tags sobreescriben los
 * derivados por iconic_taxon.
 */

export type AnimalGroup =
  | 'mamifero'
  | 'ave'
  | 'pez'
  | 'reptil'
  | 'anfibio'
  | 'invertebrado';
export type Skeleton = 'vertebrado' | 'invertebrado';
export type Birth = 'viviparo' | 'oviparo';
export type Diet = 'carnivoro' | 'herbivoro' | 'omnivoro';
export type Habitat = 'terrestre' | 'acuatico' | 'aereo';

export interface CuratedAnimal {
  /** Nombre común canónico en castellano. */
  name: string;
  /** Nombre científico (Linnaean) para matchear contra iNat. */
  scientificName?: string;
  group: AnimalGroup;
  skeleton: Skeleton;
  birth: Birth;
  diet: Diet;
  habitat: Habitat[];
  /** Dato curioso de 1-2 frases adaptado a 7 años. */
  funFact: string;
  /** Aliases adicionales por los que también puede llegar (no necesitan tilde). */
  aliases?: string[];
}

const CATALOG: CuratedAnimal[] = [
  // ─── Mamíferos ─────────────────────────────────────────────────
  { name: 'Perro', scientificName: 'Canis lupus familiaris', aliases: ['Canis familiaris'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los perros pueden oír sonidos que las personas no oímos. ¡Por eso parece que ladran sin razón!' },
  { name: 'Gato', scientificName: 'Felis catus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Los gatos pueden saltar hasta 6 veces su propia altura.' },
  { name: 'Vaca', scientificName: 'Bos taurus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las vacas tienen 4 estómagos para digerir la hierba: la mastican dos veces.' },
  { name: 'Oveja', scientificName: 'Ovis aries', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las ovejas pueden reconocer hasta 50 caras de otras ovejas.' },
  { name: 'Cabra', scientificName: 'Capra hircus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las cabras pueden trepar por paredes casi verticales gracias a sus pezuñas.' },
  { name: 'Cerdo', scientificName: 'Sus scrofa domesticus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los cerdos son tan inteligentes como los perros.' },
  { name: 'Caballo', scientificName: 'Equus ferus caballus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los caballos pueden dormir de pie sin caerse.' },
  { name: 'Conejo', scientificName: 'Oryctolagus cuniculus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los dientes de los conejos no paran de crecer en toda su vida.' },
  { name: 'Hámster', scientificName: 'Mesocricetus auratus', aliases: ['Hamster'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los hámsters guardan comida en sus mejillas hasta que llegan a casa.' },
  { name: 'Ratón', scientificName: 'Mus musculus', aliases: ['Raton'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los ratones pueden saltar hasta 30 cm de alto.' },
  { name: 'Ardilla', scientificName: 'Sciurus vulgaris', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las ardillas esconden nueces y se olvidan de algunas. ¡Por eso crecen árboles nuevos!' },
  { name: 'Erizo', scientificName: 'Erinaceus europaeus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Un erizo puede tener unas 5000 púas en su cuerpo.' },
  { name: 'Zorro', scientificName: 'Vulpes vulpes', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Los zorros usan el campo magnético de la Tierra para saltar y cazar.' },
  { name: 'Lobo', scientificName: 'Canis lupus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Los lobos viven en familias llamadas manadas y se ayudan a cazar.' },
  { name: 'Oso', scientificName: 'Ursus arctos', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los osos hibernan en invierno: pueden dormir varios meses sin comer.' },
  { name: 'Ciervo', scientificName: 'Cervus elaphus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'A los ciervos se les caen los cuernos cada año y crecen otros nuevos.' },
  { name: 'Murciélago', scientificName: 'Chiroptera', aliases: ['Murcielago'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Los murciélagos son los únicos mamíferos que pueden volar de verdad.' },
  { name: 'León', scientificName: 'Panthera leo', aliases: ['Leon'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'La melena de los leones machos crece más cuanto más fuertes se hacen.' },
  { name: 'Tigre', scientificName: 'Panthera tigris', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Cada tigre tiene un patrón de rayas único, como tu huella dactilar.' },
  { name: 'Elefante', scientificName: 'Loxodonta africana', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los elefantes recuerdan a otros elefantes durante toda su vida.' },
  { name: 'Jirafa', scientificName: 'Giraffa camelopardalis', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las jirafas tienen el mismo número de huesos en el cuello que tú: 7.' },
  { name: 'Cebra', scientificName: 'Equus quagga', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'No hay dos cebras con las mismas rayas en todo el mundo.' },
  { name: 'Hipopótamo', scientificName: 'Hippopotamus amphibius', aliases: ['Hipopotamo'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre', 'acuatico'], funFact: 'Los hipopótamos pueden correr más rápido que un humano, ¡aunque pesan 1500 kilos!' },
  { name: 'Rinoceronte', scientificName: 'Rhinocerotidae', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'El cuerno del rinoceronte está hecho de queratina, lo mismo que tus uñas.' },
  { name: 'Mono', scientificName: 'Primates', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los monos usan herramientas: piedras y palos para conseguir comida.' },
  { name: 'Koala', scientificName: 'Phascolarctos cinereus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los koalas duermen 20 horas al día. ¡Solo viven 4 horas despiertos!' },
  { name: 'Panda', scientificName: 'Ailuropoda melanoleuca', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los pandas comen 20 kilos de bambú al día. ¡Casi nada más!' },
  { name: 'Canguro', scientificName: 'Macropus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los canguros bebés viven en la bolsa de su madre los primeros meses.' },
  { name: 'Delfín', scientificName: 'Delphinus delphis', aliases: ['Delfin'], group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los delfines duermen con un ojo abierto para vigilar.' },
  { name: 'Ballena', scientificName: 'Balaenoptera musculus', group: 'mamifero', skeleton: 'vertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'La ballena azul es el animal más grande que ha existido en la Tierra.' },

  // ─── Aves ──────────────────────────────────────────────────────
  { name: 'Gallina', scientificName: 'Gallus gallus domesticus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Las gallinas pueden recordar más de 100 caras distintas.' },
  { name: 'Gallo', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los gallos cantan al amanecer porque su reloj interno detecta la luz.' },
  { name: 'Pato', scientificName: 'Anas platyrhynchos', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico', 'terrestre', 'aereo'], funFact: 'Los patos tienen plumas impermeables: el agua resbala como en un chubasquero.' },
  { name: 'Cisne', scientificName: 'Cygnus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['acuatico', 'aereo'], funFact: 'Los cisnes eligen pareja y se quedan con ella toda la vida.' },
  { name: 'Pavo', scientificName: 'Meleagris gallopavo', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los pavos pueden volar distancias cortas, aunque parecen demasiado grandes.' },
  { name: 'Paloma', scientificName: 'Columba livia', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las palomas mensajeras pueden encontrar el camino a casa desde cientos de km.' },
  { name: 'Gorrión', scientificName: 'Passer domesticus', aliases: ['Gorrion'], group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Los gorriones se bañan en arena para limpiar sus plumas.' },
  { name: 'Petirrojo', scientificName: 'Erithacus rubecula', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Solo los petirrojos machos tienen el pecho rojo brillante.' },
  { name: 'Búho', scientificName: 'Strigiformes', aliases: ['Buho'], group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Los búhos pueden girar la cabeza 270 grados sin moverse del sitio.' },
  { name: 'Águila', scientificName: 'Aquila chrysaetos', aliases: ['Aguila'], group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las águilas ven 4 veces mejor que los humanos.' },
  { name: 'Loro', scientificName: 'Psittaciformes', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['aereo', 'terrestre'], funFact: 'Algunos loros pueden vivir más de 80 años: ¡más que muchas personas!' },
  { name: 'Flamenco', scientificName: 'Phoenicopterus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Los flamencos son rosas porque comen camarones rosas.' },
  { name: 'Pingüino', scientificName: 'Spheniscidae', aliases: ['Pinguino'], group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Los pingüinos no pueden volar, ¡pero nadan súper rápido!' },
  { name: 'Pavo real', scientificName: 'Pavo cristatus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los pavos reales abren su cola gigante para impresionar a las hembras.' },
  { name: 'Cuervo', scientificName: 'Corvus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Los cuervos están entre los animales más inteligentes del planeta.' },
  { name: 'Avestruz', scientificName: 'Struthio camelus', group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los avestruces son las aves más grandes y no saben volar, pero corren mucho.' },
  { name: 'Cigüeña', scientificName: 'Ciconia ciconia', aliases: ['Cigueña', 'Ciguena'], group: 'ave', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las cigüeñas vuelan miles de kilómetros cada año al migrar.' },

  // ─── Peces ─────────────────────────────────────────────────────
  { name: 'Pez payaso', scientificName: 'Amphiprion ocellaris', group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico'], funFact: 'Los peces payaso viven entre las anémonas, que les protegen de depredadores.' },
  { name: 'Pez de colores', scientificName: 'Carassius auratus', aliases: ['Carpín dorado', 'Carpin dorado'], group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico'], funFact: 'Los peces de colores pueden recordar cosas durante meses.' },
  { name: 'Tiburón', scientificName: 'Selachimorpha', aliases: ['Tiburon'], group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los tiburones existen desde antes que los dinosaurios.' },
  { name: 'Pez globo', scientificName: 'Tetraodontidae', group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico'], funFact: 'Cuando se asustan, los peces globo se hinchan como una pelota.' },
  { name: 'Sardina', scientificName: 'Sardina pilchardus', group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Las sardinas nadan en grupos enormes para que sea difícil cazar a una sola.' },
  { name: 'Atún', scientificName: 'Thunnus', aliases: ['Atun'], group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los atunes pueden nadar a más de 70 km/h.' },
  { name: 'Salmón', scientificName: 'Salmo salar', aliases: ['Salmon'], group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los salmones nadan contra corriente para volver al río donde nacieron.' },
  { name: 'Trucha', scientificName: 'Salmo trutta', group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Las truchas pueden saltar pequeñas cascadas para subir el río.' },
  { name: 'Caballito de mar', scientificName: 'Hippocampus', group: 'pez', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'En los caballitos de mar, son los machos los que llevan los huevos.' },

  // ─── Reptiles ──────────────────────────────────────────────────
  { name: 'Lagartija', scientificName: 'Podarcis muralis', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Si pierden la cola, las lagartijas pueden hacer crecer otra nueva.' },
  { name: 'Camaleón', scientificName: 'Chamaeleonidae', aliases: ['Camaleon'], group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Los camaleones cambian de color según su humor o la temperatura.' },
  { name: 'Iguana', scientificName: 'Iguana iguana', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las iguanas tienen un tercer "ojo" en la cabeza para detectar la luz.' },
  { name: 'Cocodrilo', scientificName: 'Crocodylidae', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Los cocodrilos no han cambiado mucho en 200 millones de años.' },
  { name: 'Tortuga', scientificName: 'Testudines', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Las tortugas pueden vivir más de 100 años.' },
  { name: 'Tortuga marina', scientificName: 'Cheloniidae', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico'], funFact: 'Las tortugas marinas vuelven al mismo lugar a poner huevos donde nacieron.' },
  { name: 'Serpiente', scientificName: 'Serpentes', group: 'reptil', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Las serpientes "huelen" sacando la lengua: detectan partículas en el aire.' },

  // ─── Anfibios ──────────────────────────────────────────────────
  { name: 'Rana', scientificName: 'Anura', group: 'anfibio', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Las ranas pueden saltar 20 veces su propia longitud.' },
  { name: 'Sapo', scientificName: 'Bufonidae', group: 'anfibio', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre', 'acuatico'], funFact: 'Los sapos viven más en tierra que las ranas y solo van al agua a poner huevos.' },
  { name: 'Salamandra', scientificName: 'Caudata', group: 'anfibio', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre', 'acuatico'], funFact: 'Las salamandras pueden hacer crecer una pata si la pierden.' },
  { name: 'Tritón', scientificName: 'Triturus', aliases: ['Triton'], group: 'anfibio', skeleton: 'vertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Los tritones tienen colas con forma de pez para nadar bien.' },

  // ─── Invertebrados ─────────────────────────────────────────────
  { name: 'Abeja', scientificName: 'Apis mellifera', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['aereo', 'terrestre'], funFact: 'Una abeja produce solo una gota de miel en toda su vida.' },
  { name: 'Avispa', scientificName: 'Vespidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las avispas pueden picar muchas veces; las abejas solo una.' },
  { name: 'Mariposa', scientificName: 'Lepidoptera', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las mariposas saborean con las patas, no con la boca.' },
  { name: 'Oruga', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Las orugas comen muchísimo antes de transformarse en mariposa.' },
  { name: 'Mariquita', scientificName: 'Coccinellidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las mariquitas comen pulgones que estropean las plantas. ¡A los jardineros les encantan!' },
  { name: 'Hormiga', scientificName: 'Formicidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Las hormigas pueden levantar 50 veces su propio peso.' },
  { name: 'Araña', scientificName: 'Araneae', aliases: ['Arana'], group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'La seda de araña es más fuerte que el acero del mismo grosor.' },
  { name: 'Escorpión', scientificName: 'Scorpiones', aliases: ['Escorpion'], group: 'invertebrado', skeleton: 'invertebrado', birth: 'viviparo', diet: 'carnivoro', habitat: ['terrestre'], funFact: 'Los escorpiones brillan en azul fluorescente bajo la luz UV.' },
  { name: 'Mosca', scientificName: 'Diptera', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Las moscas tienen miles de ojos pequeñitos que ven en todas direcciones.' },
  { name: 'Mosquito', scientificName: 'Culicidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['aereo', 'terrestre'], funFact: 'Solo las mosquitas hembras pican: necesitan sangre para sus huevos.' },
  { name: 'Saltamontes', scientificName: 'Caelifera', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los saltamontes "oyen" con sus patas, no con orejas.' },
  { name: 'Grillo', scientificName: 'Gryllidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Los grillos cantan frotando sus alas, no con la voz.' },
  { name: 'Caracol', scientificName: 'Gastropoda', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'herbivoro', habitat: ['terrestre'], funFact: 'Los caracoles dejan una baba que les ayuda a deslizarse sin lastimarse.' },
  { name: 'Lombriz', scientificName: 'Lumbricidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['terrestre'], funFact: 'Las lombrices comen tierra y la dejan más rica para las plantas.' },
  { name: 'Calamar', scientificName: 'Teuthida', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los calamares cambian de color para esconderse de los depredadores.' },
  { name: 'Pulpo', scientificName: 'Octopoda', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Los pulpos tienen 9 cerebros: uno central y uno en cada brazo.' },
  { name: 'Cangrejo', scientificName: 'Brachyura', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico', 'terrestre'], funFact: 'Los cangrejos caminan de lado, no hacia delante.' },
  { name: 'Langosta', scientificName: 'Nephropidae', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Las langostas no envejecen como otros animales: pueden vivir más de 100 años.' },
  { name: 'Gamba', scientificName: 'Caridea', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'omnivoro', habitat: ['acuatico'], funFact: 'Algunas gambas pueden chasquear con sus pinzas tan fuerte como una pistola.' },
  { name: 'Medusa', scientificName: 'Scyphozoa', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Las medusas son 95% agua. ¡Casi no tienen cuerpo sólido!' },
  { name: 'Estrella de mar', scientificName: 'Asteroidea', group: 'invertebrado', skeleton: 'invertebrado', birth: 'oviparo', diet: 'carnivoro', habitat: ['acuatico'], funFact: 'Las estrellas de mar pueden hacer crecer un brazo si lo pierden.' },
];

/* ─── Lookup ────────────────────────────────────────────────────── */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const lookupMap = new Map<string, CuratedAnimal>();
for (const animal of CATALOG) {
  lookupMap.set(normalize(animal.name), animal);
  if (animal.scientificName) {
    lookupMap.set(normalize(animal.scientificName), animal);
  }
  for (const alias of animal.aliases ?? []) {
    lookupMap.set(normalize(alias), animal);
  }
}

/**
 * Busca un animal en el catálogo curado por nombre común o científico.
 * Devuelve null si no hay match (la app cae a heurísticas iNat).
 */
export function findCuratedAnimal(
  commonName: string,
  scientificName?: string,
): CuratedAnimal | null {
  const c = lookupMap.get(normalize(commonName));
  if (c) return c;
  if (scientificName) {
    const s = lookupMap.get(normalize(scientificName));
    if (s) return s;
  }
  return null;
}

/** Tamaño del catálogo (debug / about). */
export const CURATED_CATALOG_SIZE = CATALOG.length;
