interface User {
  type: 'user';
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: 'admin';
  name: string;
  age: number;
  role: string;
}

export type Person = User | Admin;

function isUser(person: Person): person is User {
  return person.type === 'user';
}

function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

type PersonTypeMap = {
  'user': User;
  'admin': Admin;
}

type CriteriaType<T> = Partial<Omit<T, 'type'>>;

export function filterPersons<T extends 'user' | 'admin'>(
  persons: Person[],
  personType: T,
  criteria: CriteriaType<PersonTypeMap[T]>
): PersonTypeMap[T][] {
  return persons
      .filter((person): person is PersonTypeMap[T] => person.type === personType)
      .filter((person) => {
          const criteriaKeys = Object.keys(criteria) as (keyof typeof criteria)[];
          return criteriaKeys.every((fieldName) => {
              return person[fieldName] === criteria[fieldName];
          });
      });
}


export const persons: Person[] = [
  { type: 'user', name: 'Sarah Chen', age: 28, occupation: 'Software Engineer' },
  { type: 'admin', name: 'Marcus Rodriguez', age: 35, role: 'System Administrator' },
  { type: 'user', name: 'Emma Thompson', age: 23, occupation: 'Data Analyst' },
  { type: 'admin', name: 'Raj Patel', age: 40, role: 'Security Manager' },
  { type: 'user', name: 'Alex Kim', age: 23, occupation: 'UX Designer' },
  { type: 'admin', name: 'Sophia Martinez', age: 23, role: 'Network Administrator' }
];

export function logPerson(person: Person) {
  console.log(
      ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
  );
}


export const usersOfAge23 = filterPersons(persons, 'user', { age: 23 });  
export const adminsOfAge23 = filterPersons(persons, 'admin', { age: 23 }); 


export const softwareEngineers = filterPersons(persons, 'user', { occupation: 'Software Engineer' });
export const securityManagers = filterPersons(persons, 'admin', { role: 'Security Manager' });

console.log('Users of age 23:');
usersOfAge23.forEach(logPerson);

console.log();

console.log('Admins of age 23:');
adminsOfAge23.forEach(logPerson);

console.log();

console.log('Software Engineers:');
softwareEngineers.forEach(logPerson);

console.log();

console.log('Security Managers:');
securityManagers.forEach(logPerson);