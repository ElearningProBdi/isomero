<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>G Unit 1 - Isomero</title>
<style>
  body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:16px;background:#f8fafc}
  .top{display:flex;justify-content:space-between;align-items:center}
  a{color:#0ea5e9;text-decoration:none;font-weight:bold}
  h1{font-size:22px}
  #player-box{background:#fff;padding:16px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
  button{cursor:pointer;border:0;border-radius:10px}
  #options button{background:#eef2ff;font-size:16px}
  #nextBtn{background:#0ea5e9;color:#fff;padding:12px 20px;margin-top:10px;width:100%;font-size:16px}
  #feedback{font-weight:bold}
</style>
</head>
<body>

<div class="top">
  <a href="unit.html">⬅️ Back</a>
  <span>⭐ Grammar</span>
</div>

<h1>Grammar Unit 1 - To Be</h1>
<p>Same engine, different data.</p>

<div id="player-box">Loading...</div>

<script src="../js/engine.js"></script>
<script src="../js/gunits.js"></script>
<script>
  ISOMERO.start(gunits, "gunit1");
</script>

</body>
</html>
