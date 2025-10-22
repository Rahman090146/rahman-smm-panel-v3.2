// Rahman SMM Panel v3.2
// Simulasi SMM versi mobile otomatis

let user = JSON.parse(localStorage.getItem("rahman_user")) || null;
let balance = localStorage.getItem("rahman_balance") || 30000;
let orders = JSON.parse(localStorage.getItem("rahman_orders")) || [];

const app = document.getElementById("app");

function save() {
  localStorage.setItem("rahman_user", JSON.stringify(user));
  localStorage.setItem("rahman_balance", balance);
  localStorage.setItem("rahman_orders", JSON.stringify(orders));
}

function showLogin() {
  app.innerHTML = `
    <div class="card">
      <h2>Login ke Rahman SMM Panel</h2>
      <input id="email" class="input" placeholder="Email atau Username" />
      <input id="password" class="input" type="password" placeholder="Password" />
      <button class="btn" onclick="login()">Login</button>
      <p class="small">Gunakan demo: <b>user: demo / pass: demo</b></p>
    </div>
  `;
}

function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  if ((email === "demo" && pass === "demo") || (email && pass)) {
    user = { email };
    save();
    showPanel();
  } else {
    alert("Login gagal. Gunakan demo/demo atau isi data valid.");
  }
}

function logout() {
  user = null;
  save();
  showLogin();
}

function addSaldo(amount) {
  balance = parseInt(balance) + amount;
  save();
  showPanel();
}

function orderNow() {
  const service = document.getElementById("service").value;
  const link = document.getElementById("link").value.trim();
  const qty = parseInt(document.getElementById("qty").value) || 0;
  const price = parseInt(document.getElementById("price").value.replace(/\D/g, ""));
  const total = Math.ceil((qty / 1000) * price);

  if (!link) return alert("Masukkan link video atau akun terlebih dahulu!");
  if (balance < total) return alert("Saldo tidak cukup! Silakan top up.");

  balance -= total;
  orders.push({ service, link, qty, total, date: new Date().toLocaleString() });
  save();
  showPanel();
  alert("Pesanan berhasil dibuat!");
}

function showPanel() {
  app.innerHTML = `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div>
          <b>Halo, ${user.email}</b><br>
          <span class="small">${user.email}@local</span>
        </div>
        <div>
          <div class="btn" style="background:#f0f7ff;color:#1276ff;border:1px solid #cfe4ff;">Rp${balance.toLocaleString()}</div>
          <button class="btn" style="background:#fff;color:#1276ff;margin-left:6px;border:1px solid #cfe4ff;" onclick="logout()">Logout</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Order Layanan</h3>
      <label>Pilih Layanan</label>
      <select id="service" class="select" onchange="updatePrice()">
        <option value="YouTube Subscribers">YouTube Subscribers</option>
        <option value="YouTube Views">YouTube Views</option>
        <option value="Instagram Followers">Instagram Followers</option>
        <option value="Jam Tayang YouTube">Jam Tayang YouTube</option>
      </select>

      <label>Link Video / Akun</label>
      <input id="link" class="input" placeholder="Masukkan link YouTube atau akun" />

      <label>Jumlah Pesanan</label>
      <input id="qty" class="input" value="100" oninput="calcTotal()" />

      <label>Harga per 1000</label>
      <input id="price" class="input" value="Rp15.000 / 1000" readonly />

      <div class="pricebox">
        <b>Total Bayar:</b>
        <div id="total">Rp1.500</div>
      </div>

      <div class="pay-method">
        <button onclick="addSaldo(10000)">+ Rp10.000</button>
        <button onclick="addSaldo(20000)">+ Rp20.000</button>
        <button onclick="addSaldo(50000)">+ Rp50.000</button>
      </div>

      <br>
      <button class="btn" style="width:100%;" onclick="orderNow()">Order Sekarang</button>
    </div>

    <div class="card">
      <h3>Riwayat Pesanan</h3>
      <div id="history">
        ${orders.length === 0
          ? "<p class='small'>Belum ada pesanan</p>"
          : orders
              .map(
                (o) => `
          <div class='pricebox'>
            <b>${o.service}</b><br>
            ${o.link}<br>
            Jumlah: ${o.qty} • Total: Rp${o.total.toLocaleString()}<br>
            <span class='small'>${o.date}</span>
          </div>`
              )
              .join("")}
      </div>
    </div>
  `;
  calcTotal();
}

function calcTotal() {
  const qty = parseInt(document.getElementById("qty").value) || 0;
  const price = parseInt(document.getElementById("price").value.replace(/\D/g, ""));
  const total = Math.ceil((qty / 1000) * price);
  document.getElementById("total").innerText = "Rp" + total.toLocaleString();
}

function updatePrice() {
  const service = document.getElementById("service").value;
  let price = 15000;
  if (service === "YouTube Views") price = 12000;
  if (service === "Instagram Followers") price = 10000;
  if (service === "Jam Tayang YouTube") price = 20000;
  document.getElementById("price").value = `Rp${price.toLocaleString()} / 1000`;
  calcTotal();
}

if (user) showPanel();
else showLogin();
