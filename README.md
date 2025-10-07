# Tassi JavaScript/TypeScript SDK

SDK JavaScript/TypeScript officiel pour l'API Tassi - Solution complète de logistique et d'expédition.

> **Compatible avec tous les frameworks JavaScript** (React, Vue, Angular, Node.js, etc.) et utilisable via CDN.

## Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Ressources disponibles](#ressources-disponibles)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Tests](#tests)
- [Support](#support-et-contribution)

## Installation

### Via npm/yarn

```bash
npm install @tassi/sdk
# ou
yarn add @tassi/sdk
```

### Via CDN (pour utilisation directe dans le navigateur)

```html
<script src="https://unpkg.com/@tassi/sdk@latest/dist/index.js"></script>
<script>
  const { Tassi, Package, Shipment, Marketplace } = TassiSDK;

  Tassi.setApiKey('votre_cle_api');
  // Utiliser le SDK...
</script>
```

## Configuration

### Node.js / Module ES

```javascript
import { Tassi } from '@tassi/sdk';

Tassi.setApiKey('votre_cle_api');
Tassi.setEnvironment('sandbox'); // ou 'live'
```

### CommonJS

```javascript
const { Tassi } = require('@tassi/sdk');

Tassi.setApiKey('votre_cle_api');
Tassi.setEnvironment('sandbox');
```

### TypeScript

```typescript
import { Tassi, Package, Shipment, Marketplace } from '@tassi/sdk';

Tassi.setApiKey('votre_cle_api');
Tassi.setEnvironment('sandbox');
```

## Utilisation

### Créer une expédition

```javascript
import { Tassi, Shipment } from '@tassi/sdk';

Tassi.setApiKey('votre_cle_api');

const shipmentData = {
  marketplace_id: '1',
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main Street',
    city: 'Cotonou',
    country_code: 'BJ'
  },
  package: {
    description: 'Colis test contenant accessoires électroniques',
    weight: 5,
    dimensions: '10x10x10',
    declared_value: '100',
    currency: 'USD',
    insurance: false
  },
  route: {
    origin: 'Cotonou',
    destination: 'Porto-Novo',
    stops: [
      {
        city: 'Sèmè-Kpodji',
        address: 'Avenue de l\'Inter, Sèmè-Kpodji',
        latitude: 6.3512,
        longitude: 2.4987
      }
    ]
  }
};

try {
  const shipment = await Shipment.create(shipmentData);
  console.log('Expédition créée:', shipment.id);
  console.log('Status:', shipment.status);
} catch (error) {
  console.error('Erreur:', error.message);
}
```

### Gérer les packages

```javascript
import { Package } from '@tassi/sdk';

// Lister tous les packages
const result = await Package.all();
console.log(`Nombre de packages: ${result.packages.length}`);

for (const pkg of result.packages) {
  console.log(`- ${pkg.tracking_number}: ${pkg.status}`);
}

// Récupérer un package spécifique
const package = await Package.retrieve(4);
console.log('Package:', package.tracking_number);
console.log('Status:', package.status);

// Mettre à jour un package
const updatedPackage = await Package.update(4, {
  description: 'Nouvelle description',
  weight: '15.0'
});

// Suivre un package
const tracking = await package.track();

// Récupérer l'étiquette d'expédition
const label = await package.getShippingLabel(1);
console.log('Étiquette:', label.shipping_label.filename);
```

### Gérer les marketplaces

```javascript
import { Marketplace } from '@tassi/sdk';

// Récupérer une marketplace
const marketplace = await Marketplace.retrieve(1);
console.log('Marketplace:', marketplace.name);
console.log('Active:', marketplace.is_active);

// Mettre à jour
const updated = await Marketplace.update(1, {
  website: 'nouveau-site.com'
});

// Historique du wallet
const history = await marketplace.getWalletHistory();
console.log(`Mouvements: ${history.wallet_movements.length}`);

for (const movement of history.wallet_movements) {
  console.log(`${movement.action}: ${movement.amount}`);
}
```

## Ressources disponibles

### Package

**Méthodes de classe:**
- `Package.all(params?, headers?)` - Liste tous les packages
- `Package.retrieve(id, headers?)` - Récupère un package par ID
- `Package.update(id, params?, headers?)` - Met à jour un package

**Méthodes d'instance:**
- `package.track(headers?)` - Suivi du package
- `package.getShippingLabel(labelId, headers?)` - Récupère l'étiquette

### Shipment

**Méthodes de classe:**
- `Shipment.create(params?, headers?)` - Crée une expédition

### Marketplace

**Méthodes de classe:**
- `Marketplace.retrieve(id, headers?)` - Récupère une marketplace
- `Marketplace.update(id, params?, headers?)` - Met à jour une marketplace

**Méthodes d'instance:**
- `marketplace.getWalletHistory(params?, headers?)` - Historique du wallet

## Gestion des erreurs

```javascript
import {
  TassiError,
  InvalidRequestError,
  ApiConnectionError,
  AuthenticationError,
  NotFoundError,
  ValidationError
} from '@tassi/sdk';

try {
  const package = await Package.retrieve('invalid_id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Package non trouvé');
  } else if (error instanceof ApiConnectionError) {
    console.error(`Erreur API (${error.httpStatus}):`, error.message);
  } else if (error instanceof InvalidRequestError) {
    console.error('Paramètres invalides:', error.message);
  } else if (error instanceof TassiError) {
    console.error('Erreur Tassi:', error.message);
  }
}
```

### Hiérarchie des exceptions

```
TassiError (base)
├── InvalidRequestError       # Paramètres invalides
├── ApiConnectionError        # Erreur HTTP
├── AuthenticationError       # Authentification échouée
├── NotFoundError            # Ressource non trouvée (404)
└── ValidationError          # Validation des données échouée
```

## Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Avec coverage
npm test -- --coverage
```

## Utilisation avec différents frameworks

### React

```jsx
import { useEffect, useState } from 'react';
import { Tassi, Package } from '@tassi/sdk';

Tassi.setApiKey(process.env.REACT_APP_TASSI_API_KEY);

function PackageList() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    async function loadPackages() {
      const result = await Package.all();
      setPackages(result.packages);
    }
    loadPackages();
  }, []);

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          {pkg.tracking_number}: {pkg.status}
        </div>
      ))}
    </div>
  );
}
```

### Vue 3

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { Tassi, Package } from '@tassi/sdk';

Tassi.setApiKey(import.meta.env.VITE_TASSI_API_KEY);

const packages = ref([]);

onMounted(async () => {
  const result = await Package.all();
  packages.value = result.packages;
});
</script>

<template>
  <div v-for="pkg in packages" :key="pkg.id">
    {{ pkg.tracking_number }}: {{ pkg.status }}
  </div>
</template>
```

### Node.js Express

```javascript
const express = require('express');
const { Tassi, Shipment } = require('@tassi/sdk');

const app = express();
Tassi.setApiKey(process.env.TASSI_API_KEY);

app.post('/shipments', async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    res.json(shipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

## Build et développement

```bash
# Installer les dépendances
npm install

# Build
npm run build

# Tests
npm test

# Build et preparer pour publication
npm run prepublishOnly
```

## Structure du projet

```
tassi-js/
├── src/
│   ├── Tassi.ts           # Configuration principale
│   ├── TassiObject.ts     # Classe de base
│   ├── TassiError.ts      # Exceptions
│   ├── Resource.ts        # Ressource de base
│   ├── Requestor.ts       # Gestionnaire HTTP
│   ├── Util.ts            # Utilitaires
│   ├── Package.ts         # Ressource Package
│   ├── Shipment.ts        # Ressource Shipment
│   ├── Marketplace.ts     # Ressource Marketplace
│   └── index.ts           # Point d'entrée
├── test/
│   ├── Package.test.ts
│   ├── Shipment.test.ts
│   └── Marketplace.test.ts
├── dist/                  # Fichiers compilés
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## Support et contribution

### Signaler un bug

Ouvrez une issue sur [GitHub Issues](https://github.com/Tassi-pro/tassi-js/issues)

### Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Informations supplémentaires

- **Version**: 1.0.0
- **Compatibilité**: Node.js >= 14, tous navigateurs modernes
- **URL de l'API**: https://tassi-api.exanora.com
- **Environnements**: sandbox, live

---

**Tassi JavaScript SDK** - Simplifiez vos intégrations logistiques