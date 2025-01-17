---
sidebar_position: 80
sidebar_class_name: formula-icon
---

# Formulas

A formula is a block of reusable Decipad language used to perform a set of operations.

Decipad has a series of built-in formulas that you can call. Some of them you've seen, like the `+`, `-`, `*`, and `/` operators, or the comparison operators like `==` or `>=`.

Other formulas include mathematical functions such as `abs` or `ln`.

This is how you call a formulas in Decipad:

```deci live
Time = -10 days
TimeSpan = abs(Time)
==> 10 days
```

## Custom formulas

Custom formula allow you to create your dialects inside Decipad.

They can be defined as follows:

**Syntax:** `CustomFormulaName (first argument, ..., last argument) = you custom expression`

To illustrate, we will create a formula to determine if a given number is even.

```deci live
even (n) = n mod 2 == 0
even(10)
==> true
```
