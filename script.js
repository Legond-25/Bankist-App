'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Nitin Nimbalkar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-09-19T14:11:59.604Z',
    '2021-09-22T17:01:17.194Z',
    '2021-09-26T23:36:17.929Z',
    '2021-09-27T10:51:36.790Z',
  ],
  locale: 'hi-IN',
  currency: 'INR',
};

const account2 = {
  owner: 'Vaishali Nimbalkar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'hi-IN',
  currency: 'INR',
};

const account3 = {
  owner: 'Manali Nimbalkar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2014-02-15T13:15:33.035Z',
    '2014-06-25T09:48:16.867Z',
    '2015-08-04T06:04:23.907Z',
    '2016-12-10T14:18:46.235Z',
    '2018-05-06T16:33:06.386Z',
    '2019-09-22T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'hi-IN',
  currency: 'INR',
};

const account4 = {
  owner: 'Atharva Nimbalkar',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2017-06-17T13:15:33.035Z',
    '2018-11-27T09:48:16.867Z',
    '2019-12-13T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  locale: 'hi-IN',
  currency: 'INR',
};

const accounts = [account1, account2, account3, account4];

// Elements
const body = document.querySelector('body');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const message = document.querySelector('.message');
const successMessage = document.querySelector('.message__success');
const errorMessage = document.querySelector('.message__error');

const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

// Displaying movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDate(date);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${new Intl.NumberFormat(acc.locale, {
        style: 'currency',
        currency: acc.currency,
      }).format(mov.toFixed(2))}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(account.balance.toFixed(2))}`;
};

// Creating usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .trim()
      .split(' ')
      .map((user) => user[0])
      .join('');
  });
};
createUsernames(accounts);

// Calculate and display summary
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(incomes.toFixed(2))}`;

  const outgoing = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(Math.abs(outgoing).toFixed(2))}`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest);
  labelSumInterest.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(interest.toFixed(2))}`;
};

// Event handlers
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = '0';
    }

    time--;
  };

  let time = 60 * 10;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Login
let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    let now = new Date();
    let day = `${now.getDate()}`.padStart(2, 0);
    let month = `${now.getMonth() + 1}`.padStart(2, 0);
    let year = now.getFullYear();

    let hour = `${now.getHours()}`.padStart(2, 0);
    let min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year} ,${hour}:${min}`;

    body.style.backgroundImage = '';
    body.style.backgroundSize = '100%';
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome, back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // UpdateUI
    updateUI(currentAccount);
  } else {
    //Hide UI and a error message
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Invalid Credentials';
    body.style.backgroundImage =
      'linear-gradient(to right bottom, #ffcb03, #ffb003)';
    body.style.backgroundSize = '200%';
  }
});

// Success and error alerts

const successMsg = function (msg) {
  successMessage.style.animationName = 'hideshow';
  successMessage.style.animationDuration = '3s';
  successMessage.style.animationTimingFunction = 'ease-in-out';
  successMessage.textContent = msg;
};

const errorMsg = function (msg) {
  errorMessage.style.animationName = 'hideshow';
  errorMessage.style.animationDuration = '3s';
  errorMessage.style.animationTimingFunction = 'ease-in-out';
  errorMessage.textContent = msg;
};

const removeAnimation = function () {
  setTimeout(() => {
    successMessage.style.removeProperty('animation-name');
    successMessage.style.removeProperty('animation-duration');
    successMessage.style.removeProperty('animation-timing-function');

    errorMessage.style.removeProperty('animation-name');
    errorMessage.style.removeProperty('animation-duration');
    errorMessage.style.removeProperty('animation-timing-function');
  }, 3001);
};

// Transfering money
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount !== currentAccount
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();

    successMsg('Amount transferred');
    removeAnimation();
  } else {
    clearInterval(timer);
    timer = startLogoutTimer();

    errorMsg('Amount not transferred');
    removeAnimation();
  }
});

// Loan functionality
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      if (mov >= amount * 0.1 && amount <= 50000) {
        return amount;
      }
    })
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      // UpdateUI
      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogoutTimer();

      successMsg('Loan approved');
      removeAnimation();
    }, 2500);
  } else {
    clearInterval(timer);
    timer = startLogoutTimer();

    errorMsg('Loan rejected');
    removeAnimation();
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Deleting Account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = '0';
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    labelWelcome.textContent = `Thank You ${
      currentAccount.owner.split(' ')[0]
    }, Account deleted `;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
